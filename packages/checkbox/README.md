<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Checkbox" alt="Solid Aria - Checkbox">
</p>

# @solid-aria/checkbox

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/checkbox?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/checkbox)
[![version](https://img.shields.io/npm/v/@solid-aria/checkbox?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/checkbox)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Checkboxes allow users to select multiple items from a list of individual items, or to mark one individual item as selected.

## Installation

```bash
npm install @solid-aria/checkbox
# or
yarn add @solid-aria/checkbox
# or
pnpm add @solid-aria/checkbox
```

## `createCheckbox`

Provides the behavior and accessibility implementation for a checkbox component.

### Features

Checkboxes can be built with the `<input>` HTML element, but this can be difficult to style. `createCheckbox` helps achieve accessible checkboxes that can be styled as needed.

- Built with a native HTML `<input>` element, which can be optionally visually hidden to allow custom styling
- Full support for browser features like form autofill
- Keyboard focus management and cross browser normalization
- Labeling support for assistive technology
- Indeterminate state support

### How to use it

```tsx
import { AriaCheckboxProps, createCheckbox } from "@solid-aria/checkbox";

function Checkbox(props: AriaCheckboxProps) {
  let ref: HTMLInputElement | undefined;

  const { inputProps, state } = createCheckbox(props, () => ref);

  return (
    <label>
      <input {...inputProps()} ref={ref} />
      <span>{props.children}</span>
    </label>
  );
}

function App() {
  return (
    <div>
      <Checkbox>Checkbox</Checkbox>
      <Checkbox isIndeterminate>Checkbox</Checkbox>
    </div>
  );
}
```

### Styling

To build a custom styled checkbox, you can make the native input element visually hidden. This is possible using the [`createVisuallyHidden`](../visually-hidden/) primitive. It is still in the DOM and accessible to assistive technology, but invisible. This example uses SVG to build the visual checkbox, which is hidden from screen readers with aria-hidden.

For keyboard accessibility, a focus ring is important to indicate which element has keyboard focus. This is implemented with the `createFocusRing` primitive. When `isFocusVisible` is true, an extra SVG element is rendered to indicate focus. The focus ring is only visible when the user is interacting with a keyboard, not with a mouse or touch.

```tsx
import { AriaCheckboxProps, createCheckbox } from "@solid-aria/checkbox";
import { createFocusRing } from "@solid-aria/focus";
import { createVisuallyHidden } from "@solid-aria/visually-hidden";

import { Show } from "solid-js/web";

function Checkbox(props: AriaCheckboxProps) {
  let ref: HTMLInputElement | undefined;

  const { inputProps, state } = createCheckbox(props, () => ref);
  const { isFocusVisible, focusProps } = createFocusRing();
  const { visuallyHiddenProps } = createVisuallyHidden();

  return (
    <label style={{ display: "flex", "align-items": "center" }}>
      <div {...visuallyHiddenProps()}>
        <input {...inputProps()} {...focusProps()} ref={ref} />
      </div>
      <svg width={24} height={24} aria-hidden="true" style={{ "margin-right": "4px" }}>
        <rect
          x={state.isSelected() ? 4 : 5}
          y={state.isSelected() ? 4 : 5}
          width={state.isSelected() ? 16 : 14}
          height={state.isSelected() ? 16 : 14}
          fill={state.isSelected() ? "orange" : "none"}
          stroke={state.isSelected() ? "none" : "gray"}
          stroke-width={2}
        />
        <Show when={state.isSelected()}>
          <path
            transform="translate(7 7)"
            d={`M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1
            1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712
            6A.999.999 0 0 1 3.788 9z`}
          />
        </Show>
        <Show when={isFocusVisible()}>
          <rect x={1} y={1} width={22} height={22} fill="none" stroke="orange" stroke-width={2} />
        </Show>
      </svg>
      {props.children}
    </label>
  );
}

function App() {
  return <Checkbox>Checkbox</Checkbox>;
}
```

### Internationalization

#### RTL

In right-to-left languages, the checkbox should be mirrored. Ensure that your CSS accounts for this.

# Checkbox Group

Checkbox groups allow users to select multiple items from a list of options.

## `createCheckboxGroup` and `createCheckboxGroupItem`

Provides the behavior and accessibility implementation for a checkbox group component.

### Features

Checkbox groups can be built in HTML with the `<fieldset>` and `<input>` elements, however these can be difficult to style. `createCheckboxGroup` and `createCheckboxGroupItem` help achieve accessible checkbox groups that can be styled as needed.

- Checkbox groups are exposed to assistive technology via ARIA
- Each checkbox is built with a native HTML `<input>` element, which can be optionally visually hidden to allow custom styling
- Full support for browser features like form autofill
- Keyboard focus management and cross browser normalization
- Group and checkbox labeling support for assistive technology

### How to use it

This example uses native input elements for the checkboxes, and SolidJS context to share state from the group to each checkbox. An HTML `<label>` element wraps the native input and the text to provide an implicit label for the checkbox.

```tsx
import {
  AriaCheckboxGroupItemProps,
  AriaCheckboxGroupProps,
  createCheckboxGroup,
  createCheckboxGroupItem
} from "@solid-aria/checkbox";

function CheckboxGroup(props: AriaCheckboxGroupProps) {
  const { CheckboxGroupProvider, groupProps, labelProps, state } = createCheckboxGroup(props);

  return (
    <div {...groupProps()}>
      <span {...labelProps()}>{props.label}</span>
      <CheckboxGroupProvider>{props.children}</CheckboxGroupProvider>
    </div>
  );
}

function Checkbox(props: AriaCheckboxGroupItemProps) {
  let ref: HTMLInputElement | undefined;

  const { inputProps, state } = createCheckboxGroupItem(props, () => ref);

  const isDisabled = () => state.isDisabled() || props.isDisabled;
  const isSelected = () => state.isSelected(props.value);

  return (
    <label
      style={{
        display: "block",
        color: (isDisabled() && "gray") || (isSelected() && "dodgerblue")
      }}
    >
      <input {...inputProps()} ref={ref} />
      {props.children}
    </label>
  );
}

function App() {
  return (
    <CheckboxGroup label="Favorite sports">
      <Checkbox value="soccer" isDisabled>
        Soccer
      </Checkbox>
      <Checkbox value="baseball">Baseball</Checkbox>
      <Checkbox value="basketball">Basketball</Checkbox>
    </CheckboxGroup>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
