<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { type Position, Toaster, toast } from "toastik";

type Variant = "default" | "success" | "error" | "info" | "warning";

const positions: Position[] = ["topLeft", "topCenter", "topRight", "bottomLeft", "bottomCenter", "bottomRight"];
const position = ref<Position>("topRight");

const isDark = ref(true);
onMounted(() => {
	isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
});
watchEffect(() => {
	document.documentElement.classList.toggle("dark", isDark.value);
});

const buttons: { variant: Variant; label: string; klass: string }[] = [
	{ variant: "default", label: "Default", klass: "from-slate-600 to-slate-700" },
	{ variant: "success", label: "Success", klass: "from-emerald-500 to-green-600" },
	{ variant: "error", label: "Error", klass: "from-rose-500 to-red-600" },
	{ variant: "info", label: "Info", klass: "from-sky-500 to-blue-600" },
	{ variant: "warning", label: "Warning", klass: "from-amber-400 to-orange-500" },
];

function fire(type: Variant) {
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

const copied = ref(false);
function copyInstall() {
	navigator.clipboard.writeText("npm i toastik").then(() => {
		copied.value = true;
		setTimeout(() => (copied.value = false), 1500);
	});
}
</script>

<template>
	<div class="page">
		<button type="button" class="theme-toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="isDark = !isDark">
			{{ isDark ? "☀" : "☾" }}
		</button>

		<main class="shell">
			<header class="hero">
				<span class="badge">Vue 3 · Tailwind 4 · zero dependencies</span>
				<h1 class="title">Toastik</h1>
				<p class="tagline">
					A lightweight toast notification component for Vue&nbsp;3 —
					swipeable, stackable, and styled with Tailwind&nbsp;4.
				</p>

				<div class="install">
					<code><span class="prompt">$</span> npm i toastik</code>
					<button type="button" class="copy" @click="copyInstall">{{ copied ? "Copied!" : "Copy" }}</button>
				</div>

				<nav class="links">
					<a href="https://github.com/OzzyCzech/toastik" target="_blank" rel="noopener">GitHub ↗</a>
					<a href="https://www.npmjs.com/package/toastik" target="_blank" rel="noopener">npm ↗</a>
				</nav>
			</header>

			<section class="panel">
				<div class="panel-row">
					<span class="panel-label">Position</span>
					<div class="segmented">
						<button
							v-for="p in positions"
							:key="p"
							type="button"
							class="seg"
							:class="{ active: position === p }"
							@click="position = p"
						>
							{{ p }}
						</button>
					</div>
				</div>

				<div class="panel-row">
					<span class="panel-label">Trigger</span>
					<div class="triggers">
						<button
							v-for="b in buttons"
							:key="b.variant"
							type="button"
							class="trigger"
							:class="b.klass"
							@click="fire(b.variant)"
						>
							{{ b.label }}
						</button>
						<button type="button" class="trigger-ghost" @click="toast.dismiss()">Dismiss all</button>
					</div>
				</div>
			</section>

			<footer class="foot">
				Released under the MIT License · made by
				<a href="https://ozana.cz" target="_blank" rel="noopener">Roman Ožana</a>
			</footer>
		</main>

		<Toaster :position="position" />
	</div>
</template>

<style scoped>
@reference "../dev/style.css";

.page {
	@apply relative min-h-screen w-full overflow-hidden;
	@apply bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100;
	@apply flex items-center justify-center px-6 py-16;
}
/* Ambient gradient glow */
.page::before {
	content: "";
	@apply pointer-events-none absolute inset-0 -z-10 opacity-70 dark:opacity-50;
	background:
		radial-gradient(40rem 40rem at 15% 0%, theme(colors.indigo.400 / 25%), transparent 60%),
		radial-gradient(35rem 35rem at 100% 100%, theme(colors.fuchsia.400 / 20%), transparent 55%);
}

.theme-toggle {
	@apply absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full text-lg cursor-pointer;
	@apply border border-slate-200 bg-white/70 backdrop-blur transition-colors;
	@apply hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-900;
}

.shell {
	@apply w-full max-w-2xl flex flex-col items-center gap-12;
}

/* Hero */
.hero {
	@apply flex flex-col items-center gap-5 text-center;
}
.badge {
	@apply rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs font-medium tracking-wide;
	@apply text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400;
}
.title {
	@apply text-6xl font-extrabold tracking-tight;
	background: linear-gradient(120deg, theme(colors.indigo.500), theme(colors.fuchsia.500) 55%, theme(colors.amber.400));
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}
.tagline {
	@apply max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400;
}

.install {
	@apply mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 p-1.5 pl-4 backdrop-blur;
	@apply dark:border-slate-800 dark:bg-slate-900/70;
}
.install code {
	@apply font-mono text-sm text-slate-700 dark:text-slate-300;
}
.install .prompt {
	@apply mr-1 select-none text-slate-400;
}
.copy {
	@apply rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer transition-colors;
	@apply hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200;
}

.links {
	@apply flex gap-5 text-sm font-medium;
}
.links a {
	@apply text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-white;
}

/* Control panel */
.panel {
	@apply w-full rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur;
	@apply flex flex-col gap-6 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-black/30;
}
.panel-row {
	@apply flex flex-col gap-3;
}
.panel-label {
	@apply text-xs font-semibold uppercase tracking-wider text-slate-400;
}

.segmented {
	@apply flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-800/60;
}
.seg {
	@apply rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 cursor-pointer transition-all;
	@apply hover:text-slate-900 dark:hover:text-white;
}
.seg.active {
	@apply bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white;
}

.triggers {
	@apply flex flex-wrap gap-2.5;
}
.trigger {
	@apply rounded-lg bg-gradient-to-br px-4 py-2 text-sm font-semibold text-white cursor-pointer;
	@apply shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0;
}
.trigger-ghost {
	@apply rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 cursor-pointer transition-colors;
	@apply hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800;
}

.foot {
	@apply text-center text-xs text-slate-400;
}
.foot a {
	@apply font-medium text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-white;
}
</style>
