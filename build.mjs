import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { loadPlugin, missingMethods } from "./vendor/inscura-scraper-skill/tools/lib/sandbox.mjs";

const root = new URL("./", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("manifest.json", root), "utf8"));
const source = await readFile(new URL("src/index.js", root), "utf8");

// 配布前に QuickJS 相当の制約で読み込み、公開メソッドとバージョンのずれを検出する。
const loaded = loadPlugin(source);
const missing = missingMethods(loaded.exports, manifest.capabilities);
if (missing.length) throw new Error(`必要なメソッドがありません: ${missing.join(", ")}`);
for (const [constant, value] of [["PLUGIN_ID", manifest.id], ["PLUGIN_VERSION", manifest.version], ["PLUGIN", manifest.name]]) {
    if (!source.includes(`var ${constant} = ${JSON.stringify(value)};`)) {
        throw new Error(`${constant} と manifest.json が一致しません。`);
    }
}

// ソース自体を単一の CommonJS として保ち、外部依存なしで再現可能な配布物を作る。
const output = new URL(manifest.entry, root);
await writeFile(output, source);
process.stdout.write(`ビルド完了: ${fileURLToPath(output)}\n`);
