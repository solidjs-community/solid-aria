<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Visually Hidden" alt="Solid Aria - Visually Hidden">
</p>

# @solid-aria/visually-hidden

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/visually-hidden?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/visually-hidden)
[![version](https://img.shields.io/npm/v/@solid-aria/visually-hidden?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/visually-hidden)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Visually hidden is a common technique for hidding an element visually, while keeping it visible to screen readers and other assistive technology. This would typically be used when you want to take advantage of the behavior and semantics of a native element like a checkbox or radio button, but replace it with a custom styled element visually.

## Installation

```bash
npm install @solid-aria/visually-hidden
# or
yarn add @solid-aria/visually-hidden
# or
pnpm add @solid-aria/visually-hidden
```

## `createVisuallyHidden`

Provides props for an element that hides its children visually, but keeps content visible to assistive technology.

### How to use it

```jsx
import { createVisuallyHidden } from "@solid-aria/visually-hidden";

function Example() {
  const { visuallyHiddenProps } = createVisuallyHidden<HTMLDivElement>();

  return <div {...visuallyHiddenProps()}>I am hidden</div>;
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
