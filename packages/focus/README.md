<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Focus" alt="Solid Aria - Focus">
</p>

# @solid-aria/focus

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/focus?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/focus)
[![version](https://img.shields.io/npm/v/@solid-aria/focus?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/focus)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Primitives for dealing with focus rings and focus management.

- [`createFocusable`](#createFocusable) - Make an element focusable, capable of auto focus and excludable from tab order.
- [`createFocusRing`](#createFocusRing) - Determines whether a focus ring should be shown to indicate keyboard focus.

## Installation

```bash
npm install @solid-aria/focus
# or
yarn add @solid-aria/focus
# or
pnpm add @solid-aria/focus
```

## `createFocusable`

Make an element focusable, capable of auto focus and excludable from tab order.

### How to use it

```tsx
import { createFocusable, CreateFocusableProps } from "@solid-aria/focus";
import { JSX, mergeProps } from "solid-js";

type TextFieldProps = JSX.IntrinsicElements["input"] & CreateFocusableProps;

function TextField(props: TextFieldProps) {
  let ref: HTMLInputElement | undefined;

  const { focusableProps } = createFocusable(props, () => ref);

  const inputProps = mergeProps(props, focusableProps);

  return <input {...inputProps} ref={ref} />;
}

function App() {
  return (
    <>
      <TextField autoFocus />
      <TextField excludeFromTabOrder />
    </>
  );
}
```

## `createFocusRing`

The `createFocusRing` primitive returns whether a focus ring should be displayed to indicate keyboard focus for a component. This helps keyboard users determine which element on a page or in an application has keyboard focus as they navigate around. Focus rings are only visible when interacting with a keyboard so as not to distract mouse and touch screen users.

### How to use it

This example shows how to use `createFocusRing` to adjust styling when keyboard focus is on a button. Specifically, the outline property is used to create the focus ring when `isFocusVisible` is true.

```tsx
import { createFocusRing } from "@solid-aria/focus";

function Example() {
  const { isFocusVisible, focusProps } = createFocusRing();

  return (
    <button
      {...focusProps()}
      style={{
        "-webkit-appearance": "none",
        appearance: "none",
        background: "green",
        border: "none",
        color: "white",
        "font-size": "14px",
        padding: "4px 8px",
        outline: isFocusVisible() ? "2px solid dodgerblue" : "none",
        "outline-offset": "2px"
      }}
    >
      Test
    </button>
  );
}
```

See [`createCheckbox`](../checkbox/), [`createRadioGroup`](../radio/), and [`createSwitch`](../switch/) for more advanced examples of focus rings with other styling techniques.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
