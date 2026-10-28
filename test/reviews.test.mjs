import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { configDefaults, loadPlugin } from "../vendor/inscura-scraper-skill/tools/lib/sandbox.mjs";
import { checkResult } from "../vendor/inscura-scraper-skill/tools/lib/results.mjs";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL("manifest.json", root), "utf8"));
const source = fs.readFileSync(new URL(manifest.entry, root), "utf8");
const fixtures = JSON.parse(fs.readFileSync(new URL("fixtures/api.json", root), "utf8"));

// FANZA の空レビューをキャッシュすると JSON null になる。欠損や失敗とは区別する。
test("空のレビューキャッシュだけを空配列として扱い、不正な応答と HTTP エラーは通知する", async () => {
    for (const scenario of [
        { body: { data: null }, count: "0" },
        { body: { data: [] }, count: "0" },
        { body: {}, error: true },
        { body: { data: {} }, error: true },
        { body: { error: "unavailable", data: null }, error: true },
        { status: 404, body: { data: null }, error: true },
        { status: 429, body: { data: null }, error: true },
    ]) {
        let calls = 0;
        const ctx = {
            config: { ...configDefaults(manifest), apiUrl: "https://metatube.example.invalid", includeReviews: true, detailMode: "lazy" },
            request: {},
            fetch: async (url) => {
                calls++;
                if (url.includes("/v1/reviews/")) {
                    const status = scenario.status ?? 200;
                    return { ok: status < 400, status, json: async () => scenario.body };
                }
                const fixture = fixtures.requests.find((item) => item.url === url);
                assert.ok(fixture, `未定義のリクエスト: ${url}`);
                return { ok: true, status: 200, json: async () => fixture.json };
            },
        };
        const promise = loadPlugin(source, fileURLToPath(new URL(manifest.entry, root))).exports.getMediaDetail("FANZA", "movie-1", ctx);
        if (scenario.error) await assert.rejects(promise);
        else {
            const result = await promise;
            checkResult("media", "detail", result, "FANZA");
            assert.equal(result.customFields.find((field) => field.metaKey === "review_count").value, scenario.count);
            assert.equal(result.customFields.find((field) => field.metaKey === "reviews"), undefined);
            assert.equal(result.id, "movie-1");
        }
        assert.equal(calls, 2);
    }
});
