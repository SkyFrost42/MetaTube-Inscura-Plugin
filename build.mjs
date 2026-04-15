import { copyFile, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(rootDir, ".build");

await rm(outDir, { force: true, recursive: true });
await build({
    configFile: resolve(rootDir, "vite.config.mjs"),
});
await copyFile(resolve(outDir, "index.js"), resolve(rootDir, "index.js"));
await rm(outDir, { force: true, recursive: true });
