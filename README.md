# Toastik

A lightweight, dependency-free toast notification component for **Vue 3**, styled with **Tailwind CSS 4**.
Stacked toasts, swipe-to-dismiss, auto-dismiss, six positions, dark mode, and inlined SVG icons — no icon library required.

## Install

```sh
npm install toastik
```

`vue` (>= 3.5) is the only peer dependency.

## Usage

Import the stylesheet once (e.g. in your entry file), drop a `<Toaster />` somewhere near the app root, and call `toast()` anywhere.

```ts
// main.ts
import "toastik/style.css";
```

```vue
<script setup lang="ts">
import { Toaster, toast } from "toastik";
</script>

<template>
	<button @click="toast.success('Saved!', { title: 'Done' })">Save</button>
	<Toaster position="topRight" />
</template>
```

### Plugin / composable (optional)

```ts
import { createApp } from "vue";
import Toastik from "toastik";
import "toastik/style.css";

createApp(App).use(Toastik).mount("#app"); // exposes this.$toast
```

```ts
import { useToast } from "toastik";
const toast = useToast();
```

## API

```ts
toast(message, options);          // default toast
toast.success(message, options);
toast.error(message, options);
toast.info(message, options);
toast.warning(message, options);
toast.message(message, options);
toast.dismiss(id?);               // dismiss one, or all when called with no id
```

**Options** (`Partial<ToastT>`): `title`, `message`, `type`, `duration` (ms or `false` to disable auto-dismiss), `icon` (custom SVG/HTML string), `id` (reuse to update an existing toast).

**`<Toaster>` props**: `position` — one of `topLeft`, `topCenter`, `topRight`, `bottomLeft`, `bottomCenter`, `bottomRight` (default `topRight`).

> `title` and `message` are rendered with `v-html`. Sanitize any untrusted input before passing it in.

## Dark mode

Toastik uses Tailwind's class strategy — add the `dark` class to a parent (e.g. `<html class="dark">`).

## Development

```sh
npm run dev      # playground at localhost
npm run build    # build the library into dist/
```

## License

MIT
