<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { type Position, Toaster, toast } from "toastik";

const positions: Position[] = ["topLeft", "topCenter", "topRight", "bottomLeft", "bottomCenter", "bottomRight"];
const position = ref<Position>("topRight");

const isDark = ref(true);
onMounted(() => {
	isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
});
watchEffect(() => {
	document.documentElement.classList.toggle("dark", isDark.value);
});

function fire(type: "default" | "success" | "error" | "info" | "warning") {
	const messages = {
		default: { title: "Heads up", message: "Just a plain notification." },
		success: { title: "Saved", message: "Your changes were stored successfully." },
		error: { title: "Something broke", message: "We couldn't reach the server. Try again." },
		info: { title: "Did you know?", message: "You can swipe a toast away horizontally." },
		warning: { title: "Careful", message: "Your session expires in 5 minutes." },
	};
	const { title, message } = messages[type];
	if (type === "default") toast(message, { title });
	else toast[type](message, { title });
}
</script>

<template>
	<main class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-10">
		<h1 class="text-2xl font-bold mb-6">Toastik playground</h1>

		<div class="mb-6 flex flex-wrap items-center gap-3">
			<label class="text-sm font-medium">Position:</label>
			<select v-model="position" class="rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-sm">
				<option v-for="p in positions" :key="p" :value="p">{{ p }}</option>
			</select>
			<button type="button" class="btn-ghost" @click="isDark = !isDark">
				{{ isDark ? "☀ Light" : "☾ Dark" }}
			</button>
		</div>

		<div class="flex flex-wrap gap-3">
			<button class="btn" @click="fire('default')">Default</button>
			<button class="btn" @click="fire('success')">Success</button>
			<button class="btn" @click="fire('error')">Error</button>
			<button class="btn" @click="fire('info')">Info</button>
			<button class="btn" @click="fire('warning')">Warning</button>
			<button class="btn" @click="toast.dismiss()">Dismiss all</button>
		</div>

		<Toaster :position="position" />
	</main>
</template>

<style scoped>
@reference "../dev/style.css";
.btn {
	@apply rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium cursor-pointer;
	@apply hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors;
}
.btn-ghost {
	@apply rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1 text-sm font-medium cursor-pointer;
	@apply hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors;
}
</style>
