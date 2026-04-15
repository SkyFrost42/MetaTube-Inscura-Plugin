import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        copyPublicDir: false,
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, "src/index.js"),
            fileName: function () {
                return "index.js";
            },
            formats: ["cjs"],
            name: "MetaTubePlugin",
        },
        minify: "esbuild",
        outDir: resolve(__dirname, ".build"),
        reportCompressedSize: false,
        rollupOptions: {
            output: {
                exports: "default",
            },
        },
        sourcemap: false,
        target: "es2018",
    },
});
