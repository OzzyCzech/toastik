<script lang="ts" setup>
import { type CSSProperties, computed, onMounted, ref, watch, watchEffect } from "vue";
import { closeIcon, type HeightT, SWIPE_THRESHOLD, TIME_BEFORE_UNMOUNT, type ToastT } from "./types";

const props = defineProps<{
	toast: ToastT;
	toasts: ToastT[];
	index: number;
	toastsCount: number;
	expanded: boolean;
	interacting: boolean;
	heights: HeightT[];
	visibleToasts: number;
	gap: number;
}>();

const emit = defineEmits<{
	"update:height": [height: number];
	remove: [toast: ToastT];
}>();

const toastRef = ref<HTMLLIElement>();
const mounted = ref(false);
const removed = ref(false);
const swiping = ref(false);
const swipeOut = ref(false);
const offsetBeforeRemove = ref(0);
const initialHeight = ref(0);

const remainingTime = ref(typeof props.toast.duration === "number" ? props.toast.duration : 0);
const closeTimerStart = ref(0);

const swipeStartX = ref(0);
const swipeDeltaX = ref(0);

const isFront = computed(() => props.index === 0);
const isVisible = computed(() => props.index < props.visibleToasts);

const offset = computed(() => {
	if (props.index <= 0) return 0;
	let total = 0;
	for (let i = 0; i < props.index; i++) {
		const h = props.heights.find((h) => h.toastId === props.toasts[i].id);
		if (h) total += h.height;
	}
	return props.index * props.gap + total;
});

const toastStyle = computed<CSSProperties>(() => ({
	"--index": props.index,
	"--toasts-before": props.index,
	"--z-index": props.toastsCount - props.index,
	"--offset": `${removed.value ? offsetBeforeRemove.value : offset.value}px`,
	"--initial-height": `${initialHeight.value}px`,
	"--swipe-amount": `${swipeDeltaX.value}px`,
}));

watchEffect((onCleanup) => {
	if (!props.toast.duration) return;

	let timeoutId: ReturnType<typeof setTimeout>;

	if (props.expanded || props.interacting) {
		const elapsed = Date.now() - closeTimerStart.value;
		remainingTime.value = Math.max(remainingTime.value - elapsed, 0);
	} else {
		closeTimerStart.value = Date.now();
		const duration = remainingTime.value + (props.toast.message?.length || 0) * 30;
		timeoutId = setTimeout(() => deleteToast(), duration);
	}

	onCleanup(() => clearTimeout(timeoutId));
});

watch(
	() => props.toast.delete,
	(val) => {
		if (val) deleteToast();
	},
);

function deleteToast() {
	if (removed.value) return;
	removed.value = true;
	offsetBeforeRemove.value = offset.value;
	setTimeout(() => emit("remove", props.toast), TIME_BEFORE_UNMOUNT);
}

function onPointerDown(event: PointerEvent) {
	if (event.button !== 0) return;
	if ((event.target as HTMLElement).closest("button")) return;
	toastRef.value?.setPointerCapture(event.pointerId);
	swiping.value = true;
	swipeStartX.value = event.clientX;
}

function onPointerMove(event: PointerEvent) {
	if (!swiping.value) return;
	swipeDeltaX.value = event.clientX - swipeStartX.value;
}

function onPointerUp() {
	if (Math.abs(swipeDeltaX.value) >= SWIPE_THRESHOLD) {
		swipeOut.value = true;
		offsetBeforeRemove.value = offset.value;
		setTimeout(() => emit("remove", props.toast), TIME_BEFORE_UNMOUNT);
	} else {
		swipeDeltaX.value = 0;
	}
	swiping.value = false;
}

onMounted(() => {
	const el = toastRef.value;
	if (el) {
		initialHeight.value = el.getBoundingClientRect().height;
		emit("update:height", initialHeight.value);
	}
	requestAnimationFrame(() => {
		mounted.value = true;
	});
});
</script>

<template>
	<li
		ref="toastRef"
		class="toast"
		:data-type="toast.type"
		:data-mounted="mounted"
		:data-removed="removed"
		:data-expanded="expanded"
		:data-front="isFront"
		:data-swiping="swiping"
		:data-swipe-out="swipeOut"
		:data-visible="isVisible"
		:style="toastStyle"
		@pointerdown="onPointerDown"
		@pointerup="onPointerUp"
		@pointermove="onPointerMove"
	>
		<!-- icon markup is generated from a fixed SVG allow-list in types.ts, not user input -->
		<div v-if="toast.icon" class="toast-icon" v-html="toast.icon" />
		<div class="toast-content">
			<strong v-if="toast.title">{{ toast.title }}</strong>
			<!-- message may contain caller-provided HTML; sanitize before passing untrusted input -->
			<div class="toast-message" v-html="toast.message" />
		</div>
		<button class="toast-close" aria-label="Close" type="button" @click.prevent="deleteToast" v-html="closeIcon" />
	</li>
</template>
