<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Button" alt="Solid Aria - Button">
</p>

# @solid-aria/button

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/button?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/button)
[![version](https://img.shields.io/npm/v/@solid-aria/button?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/button)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Buttons allow users to perform an action or to navigate to another page. They have multiple styles for various needs, and are ideal for calling attention to where a user needs to do something in order to move forward in a flow.

## Installation

```bash
npm install @solid-aria/button
# or
yarn add @solid-aria/button
# or
pnpm add @solid-aria/button
```

## `createButton`

Provides the behavior and accessibility implementation for a button component. Handles mouse, keyboard, and touch interactions, focus behavior, and ARIA props for both native button elements and custom element types.

### Features

On the surface, building a custom styled button seems simple. However, there are many cross browser inconsistencies in interactions and accessibility features to consider. `createButton` handles all of these interactions for you, so you can focus on the styling.

- Native HTML `<button>` support
- `<a>` and custom element type support via ARIA
- Mouse and touch event handling, and press state management
- Keyboard focus management and cross browser normalization
- Keyboard event support for `Space` and `Enter` keys

### How to use it

By default, `createButton` assumes that you are using it with a native `<button>` element.

```tsx
import { AriaButtonProps, createButton } from "@solid-aria/button";

function Button(props: AriaButtonProps) {
  let ref: HTMLButtonElement | undefined;

  const { buttonProps } = createButton(props, () => ref);

  return (
    <button {...buttonProps()} ref={ref}>
      {props.children}
    </button>
  );
}

function App() {
  return <Button onPress={() => alert("Button pressed!")}>Test</Button>;
}
```

### Using a custom element type

Sometimes you might need to use an element other than a native `<button>`. `createButton` supports this via the `elementType` prop. When used with an element other than a native button, `createButton` automatically applies the necessary ARIA roles and attributes to ensure that the element is exposed to assistive technology as a button.

In addition, this example shows usage of the `isPressed` value returned by `createButton` to properly style the button's active state. You could use the CSS `:active` pseudo class for this, but `isPressed` properly handles when the user drags their pointer off of the button, along with keyboard support and better touch screen support.

```tsx
import { AriaButtonProps, createButton } from "@solid-aria/button";
import { mergeProps } from "solid-js";

function Button(props: AriaButtonProps<"span">) {
  let ref: HTMLButtonElement | undefined;

  const createButtonProps = mergeProps({ elementType: "span" }, props);

  const { buttonProps, isPressed } = createButton(createButtonProps, () => ref);

  return (
    <span
      {...buttonProps()}
      style={{
        background: isPressed() ? "darkgreen" : "green",
        color: "white",
        padding: "10px",
        cursor: "pointer",
        "user-select": "none",
        "-webkit-user-select": "none"
      }}
      ref={ref}
    >
      {props.children}
    </span>
  );
}

function App() {
  return <Button onPress={() => alert("Button pressed!")}>Test</Button>;
}
```

## `createToggleButton`

Provides the behavior and accessibility implementation for a toggle button component. ToggleButtons allow users to toggle a selection on or off, for example switching between two states or modes.

### Features

Toggle buttons are similar to action buttons, but support an additional selection state that is toggled when a user presses the button. There is no built-in HTML element that represents a toggle button, so Solid Aria implements it using ARIA attributes.

- Native HTML `<button>`, `<a>`, and custom element type support
- Exposed as a toggle button via ARIA
- Mouse and touch event handling, and press state management
- Keyboard focus management and cross browser normalization
- Keyboard event support for `Space` and `Enter` keys

### How to use it

By default, `createToggleButton` assumes that you are using it with a native `<button>` element. You can use a custom element type by passing the `elementType` prop to `createToggleButton`. See the `createButton` docs for an example of this.

The following example shows how to use the `createToggleButton` to build a toggle button. The toggle state is used to switch between a green and blue background when unselected and selected respectively. In addition, the `isPressed` state is used to adjust the background to be darker when the user presses down on the button.

```tsx
import { AriaToggleButtonProps, createToggleButton } from "@solid-aria/button";

function ToggleButton(props: AriaToggleButtonProps) {
  let ref: HTMLButtonElement | undefined;

  const { buttonProps, isPressed, state } = createToggleButton(props, () => ref);

  return (
    <button
      {...buttonProps()}
      style={{
        background: isPressed()
          ? state.isSelected()
            ? "darkblue"
            : "darkgreen"
          : state.isSelected()
          ? "blue"
          : "green",
        color: "white",
        padding: "10px",
        cursor: "pointer",
        "user-select": "none",
        "-webkit-user-select": "none",
        border: "none"
      }}
      ref={ref}
    >
      {props.children}
    </button>
  );
}

function App() {
  return <ToggleButton>Test</ToggleButton>;
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
