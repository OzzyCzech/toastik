import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/toastik/",
	plugins: [vue(), tailwindcss()],
	build: {
		outDir: "dist-demo",
		emptyOutDir: true,
	},
});
