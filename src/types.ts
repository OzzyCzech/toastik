export type ToastType = "info" | "success" | "warning" | "error" | "default";
export type Position = "topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight";

export type ToastT = {
	id: string;
	title?: string;
	message?: string;
	type: ToastType;
	duration?: number | false;
	icon?: string;
	delete?: boolean;
};

export type HeightT = {
	toastId: string;
	height: number;
};

export type ToastToDismiss = {
	id: string;
	dismiss: true;
};

export const VISIBLE_TOASTS = 3;
export const TOAST_WIDTH = 400;
export const GAP = 8;
export const TOAST_LIFETIME = 4000;
export const SWIPE_THRESHOLD = 45;
export const TIME_BEFORE_UNMOUNT = 200;

const icon = (paths: string): string =>
	`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const closeIcon = icon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>');

export const defaultIcons: Record<ToastType, string> = {
	success: icon('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
	error: icon('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'),
	info: icon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
	warning: icon('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
	default: "",
};
