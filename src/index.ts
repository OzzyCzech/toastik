import { type App, inject } from "vue";
import { type Toast, toast } from "./state";
import "./toasts.css";

export { default as Toaster } from "./Toaster.vue";
export { toast } from "./state";
export type { Toast } from "./state";
export type { Position, ToastT, ToastType } from "./types";

const ToastKey = Symbol("toastik");

/**
 * Composable access to the toast API. Works with or without the plugin
 * installed, since `toast` is a module-level singleton.
 */
export function useToast(): Toast {
	return inject<Toast>(ToastKey, toast);
}

export default {
	install(app: App) {
		app.provide<Toast>(ToastKey, toast);
		app.config.globalProperties.$toast = toast;
	},
};

declare module "vue" {
	interface ComponentCustomProperties {
		$toast: Toast;
	}
}
