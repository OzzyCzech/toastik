import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		vue(),
		tailwindcss(),
		dts({ tsconfigPath: "./tsconfig.json", include: ["src"] }),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "Toastik",
			formats: ["es"],
			fileName: "index",
		},
		rollupOptions: {
			external: ["vue"],
			output: {
				globals: { vue: "Vue" },
				assetFileNames: (asset) => (asset.names?.[0]?.endsWith(".css") ? "toastik.css" : "[name][extname]"),
			},
		},
	},
});
