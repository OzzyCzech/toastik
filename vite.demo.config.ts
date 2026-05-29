import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/toastik/",
	// The demo behaves like a real consumer: it imports the compiled library
	// and its precompiled stylesheet from dist (run `npm run build` first).
	resolve: {
		alias: [
			{ find: "toastik/style.css", replacement: resolve(__dirname, "dist/toastik.css") },
			{ find: "toastik", replacement: resolve(__dirname, "dist/index.js") },
		],
	},
	plugins: [vue(), tailwindcss()],
	build: {
		outDir: "dist-demo",
		emptyOutDir: true,
	},
});
