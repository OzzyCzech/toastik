<script lang="ts" setup>
import { type CSSProperties, computed, onMounted, onUnmounted, ref } from "vue";
import { ToastState } from "./state";
import ToastItem from "./ToastItem.vue";
import { GAP, type HeightT, type Position, TOAST_WIDTH, type ToastT, type ToastToDismiss, VISIBLE_TOASTS } from "./types";

const { position = "topRight" } = defineProps<{
	position?: Position;
}>();

const toasts = ref<ToastT[]>([]);
const heights = ref<HeightT[]>([]);
const expanded = ref(false);
const interacting = ref(false);
let unsubscribe: (() => void) | undefined;

const isBottom = computed(() => position.startsWith("bottom"));

const frontHeight = computed(() => {
	if (!toasts.value.length) return 0;
	return heights.value.find((h) => h.toastId === toasts.value[0].id)?.height || 0;
});

const listStyle = computed<CSSProperties>(() => {
	if (!toasts.value.length) return { width: `${TOAST_WIDTH}px`, height: "0px" };

	const totalHeight = toasts.value.reduce((sum, t) => {
		const h = heights.value.find((h) => h.toastId === t.id);
		return sum + (h?.height || 0);
	}, 0);
	const h = expanded.value
		? totalHeight + (toasts.value.length - 1) * GAP
		: frontHeight.value + Math.min(toasts.value.length - 1, VISIBLE_TOASTS - 1) * GAP;

	return {
		width: `${TOAST_WIDTH}px`,
		height: `${h}px`,
		"--front-toast-height": `${frontHeight.value}px`,
		"--gap": `${GAP}px`,
		"--lift": isBottom.value ? -1 : 1,
	};
});

function onHeightUpdate(toastId: string, height: number) {
	const idx = heights.value.findIndex((h) => h.toastId === toastId);
	if (idx > -1) {
		heights.value[idx] = { toastId, height };
	} else {
		heights.value = [{ toastId, height }, ...heights.value];
	}
}

function removeToast(toast: ToastT) {
	toasts.value = toasts.value.filter((t) => t.id !== toast.id);
	heights.value = heights.value.filter((h) => h.toastId !== toast.id);
}

function onMouseLeave() {
	if (!interacting.value) expanded.value = false;
}

onMounted(() => {
	unsubscribe = ToastState.subscribe((data) => {
		if ("dismiss" in data) {
			toasts.value = toasts.value.map((t) => (t.id === (data as ToastToDismiss).id ? { ...t, delete: true } : t));
			return;
		}
		const toast = data as ToastT;
		const idx = toasts.value.findIndex((t) => t.id === toast.id);
		if (idx > -1) {
			toasts.value[idx] = { ...toasts.value[idx], ...toast };
		} else {
			toasts.value = [toast, ...toasts.value];
		}
	});
});

onUnmounted(() => unsubscribe?.());
</script>

<template>
	<section aria-label="Notifications" class="toast-section" :data-position="position">
		<ol
			class="toast-list"
			:data-expanded="expanded"
			:style="listStyle"
			@mouseenter="expanded = true"
			@mouseleave="onMouseLeave"
			@pointerdown="interacting = true"
			@pointerup="interacting = false"
		>
			<ToastItem
				v-for="(t, index) in toasts"
				:key="t.id"
				:toast="t"
				:toasts="toasts"
				:index="index"
				:toasts-count="toasts.length"
				:expanded="expanded"
				:interacting="interacting"
				:heights="heights"
				:visible-toasts="VISIBLE_TOASTS"
				:gap="GAP"
				@update:height="(height) => onHeightUpdate(t.id, height)"
				@remove="removeToast"
			/>
		</ol>
	</section>
</template>
