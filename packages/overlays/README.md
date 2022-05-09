<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Overlays" alt="Solid Aria - Overlays">
</p>

# @solid-aria/overlays

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/overlays?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/overlays)
[![version](https://img.shields.io/npm/v/@solid-aria/overlays?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/overlays)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Primitives for building accessible overlay components such as dialogs, popovers, and menus.

## Installation

```bash
npm install @solid-aria/overlays
# or
yarn add @solid-aria/overlays
# or
pnpm add @solid-aria/overlays
```

## `createPreventScrollEffect`

Prevents scrolling on the document body on mount, and restores it on unmount. Also ensures that content does not shift due to the scrollbars disappearing.

### How to use it

```tsx
import { createPreventScrollEffect } from "@solid-aria/overlays";
import { createSignal } from "solid-js";

function App() {
  const [isDisabled, setDisabled] = createSignal(false);

  createPreventScrollEffect({ isDisabled });

  return (
    <>
      <button onClick={() => setDisabled(prev => !prev)}>Toggle scroll lock</button>
      <p>Very long scrollable content...</p>
    </>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
