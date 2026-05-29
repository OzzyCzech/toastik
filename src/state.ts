import { defaultIcons, TOAST_LIFETIME, type ToastT, type ToastToDismiss, type ToastType } from "./types";

let count = 0;

class Observer {
	private subscribers: Array<(toast: ToastT | ToastToDismiss) => void> = [];
	private toasts: ToastT[] = [];

	subscribe(subscriber: (toast: ToastT | ToastToDismiss) => void): () => void {
		this.subscribers.push(subscriber);
		return () => {
			const idx = this.subscribers.indexOf(subscriber);
			if (idx > -1) this.subscribers.splice(idx, 1);
		};
	}

	private publish(data: ToastT | ToastToDismiss): void {
		for (const subscriber of this.subscribers) subscriber(data);
	}

	create(data: Partial<ToastT> & { message: string }): string {
		const id = data.id || String(count++);
		const type: ToastType = data.type || "default";
		const icon = data.icon === undefined ? defaultIcons[type] : data.icon;

		const existing = this.toasts.find((t) => t.id === id);
		if (existing) {
			this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, ...data, id, type, icon } : t));
			this.publish({ ...existing, ...data, id, type, icon });
		} else {
			const toast: ToastT = { duration: TOAST_LIFETIME, ...data, id, type, icon };
			this.toasts = [...this.toasts, toast];
			this.publish(toast);
		}
		return id;
	}

	dismiss(id?: string): void {
		if (id) {
			requestAnimationFrame(() => {
				for (const sub of this.subscribers) sub({ id, dismiss: true });
			});
			this.toasts = this.toasts.filter((t) => t.id !== id);
		} else {
			for (const t of this.toasts) {
				for (const sub of this.subscribers) sub({ id: t.id, dismiss: true });
			}
			this.toasts = [];
		}
	}

	message = (message: string, data: Partial<ToastT> = {}): string => this.create({ ...data, message });
	success = (message: string, data: Partial<ToastT> = {}): string => this.create({ ...data, type: "success", message });
	error = (message: string, data: Partial<ToastT> = {}): string => this.create({ ...data, type: "error", message });
	info = (message: string, data: Partial<ToastT> = {}): string => this.create({ ...data, type: "info", message });
	warning = (message: string, data: Partial<ToastT> = {}): string => this.create({ ...data, type: "warning", message });
}

export const ToastState = new Observer();

function toastFn(message: string, data: Partial<ToastT> = {}): string {
	return ToastState.create({ ...data, message });
}

export const toast = Object.assign(toastFn, {
	show: toastFn,
	success: ToastState.success,
	error: ToastState.error,
	info: ToastState.info,
	warning: ToastState.warning,
	message: ToastState.message,
	dismiss: (id?: string) => ToastState.dismiss(id),
});

export type Toast = typeof toast;
