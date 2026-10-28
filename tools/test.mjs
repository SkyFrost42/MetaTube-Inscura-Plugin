import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const result = spawnSync(process.execPath, ["--test", "vendor/inscura-scraper-skill/checks/metatube.mjs", "test/reviews.test.mjs"], {
    cwd: root,
    // 検証対象を明示し、参照実装だけをテストしてしまう事故を防ぐ。
    env: { ...process.env, INSCURA_METATUBE_PLUGIN_DIR: root },
    stdio: "inherit",
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
