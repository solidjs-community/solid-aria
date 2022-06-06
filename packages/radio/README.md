<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Radio" alt="Solid Aria - Radio">
</p>

# @solid-aria/radio

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/radio?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/radio)
[![version](https://img.shields.io/npm/v/@solid-aria/radio?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/radio)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Radio buttons allow users to select a single option from a list of mutually exclusive options. All possible options are exposed up front for users to compare.

## Installation

```bash
npm install @solid-aria/radio
# or
yarn add @solid-aria/radio
# or
pnpm add @solid-aria/radio
```

## `createRadio`

Provides the behavior and accessibility implementation for a radio component.

### Features

Radio can be built with the `<input>` HTML element, but this can be difficult to style. `createRadio` helps achieve accessible radios that can be styled as needed.

- Built with a native HTML `<input>` element, which can be optionally visually hidden to allow custom styling
- Full support for browser features like form autofill
- Keyboard focus management and cross browser normalization
- Labeling support for assistive technology

## `createRadioGroup`

Provides the behavior and accessibility implementation for a radio group component. Radio groups allow users to select a single item from a list of mutually exclusive options.

### Features

Radio groups can be built in HTML with the `<fieldset>` and `<input>` elements, however these can be difficult to style. useRadioGroup and useRadio help achieve accessible radio groups that can be styled as needed.

- Radio groups are exposed to assistive technology via ARIA
- Each radio is built with a native HTML `<input>` element, which can be optionally visually hidden to allow custom styling
- Full support for browser features like form autofill
- Keyboard focus management and cross browser normalization
- Group and radio labeling support for assistive technology

### How to use it

This example uses native input elements for the radios, and SolidJS context to share state from the group to each radio. An HTML `<label>` element wraps the native input and the text to provide an implicit label for the radio.

```tsx
import {
  AriaRadioGroupProps,
  AriaRadioProps,
  createRadio,
  createRadioGroup
} from "@solid-aria/radio";

function RadioGroup(props: AriaRadioGroupProps) {
  const { RadioGroupProvider, groupProps, labelProps, state } = createRadioGroup(props);

  return (
    <div {...groupProps()}>
      <span {...labelProps()}>{props.label}</span>
      <RadioGroupProvider>{props.children}</RadioGroupProvider>
    </div>
  );
}

function Radio(props: AriaRadioProps) {
  let ref: HTMLInputElement | undefined;

  const { inputProps, state } = createRadio(props, () => ref);

  return (
    <label style={{ display: "block" }}>
      <input {...inputProps} ref={ref} />
      {props.children}
    </label>
  );
}

function App() {
  return (
    <RadioGroup label="Favorite pet">
      <Radio value="dogs">Dogs</Radio>
      <Radio value="cats">Cats</Radio>
    </RadioGroup>
  );
}
```

### Styling

To build a custom styled radio button, you can make the native input element visually hidden. This is possible using the [`createVisuallyHidden`](../visually-hidden/) primitive. It is still in the DOM and accessible to assistive technology, but invisible. This example uses SVG to build the visual radio button, which is hidden from screen readers with aria-hidden.

For keyboard accessibility, a focus ring is important to indicate which element has keyboard focus. This is implemented with the `createFocusRing` primitive. When `isFocusVisible` is true, an extra SVG element is rendered to indicate focus. The focus ring is only visible when the user is interacting with a keyboard, not with a mouse or touch.

```tsx
import { createFocusRing } from "@solid-aria/focus";
import {
  AriaRadioGroupProps,
  AriaRadioProps,
  createRadio,
  createRadioGroup
} from "@solid-aria/radio";
import { createVisuallyHidden } from "@solid-aria/visually-hidden";

function RadioGroup(props: AriaRadioGroupProps) {
  const { RadioGroupProvider, groupProps, labelProps, state } = createRadioGroup(props);

  return (
    <div {...groupProps()}>
      <span {...labelProps()}>{props.label}</span>
      <RadioGroupProvider>{props.children}</RadioGroupProvider>
    </div>
  );
}

function Radio(props: AriaRadioProps) {
  let ref: HTMLInputElement | undefined;

  const { inputProps, state } = createRadio(props, () => ref);
  const { isFocusVisible, focusProps } = createFocusRing();
  const { visuallyHiddenProps } = createVisuallyHidden();

  const isSelected = () => state.selectedValue() === props.value;
  const strokeWidth = () => (isSelected() ? 6 : 2);

  return (
    <label style={{ display: "flex", "align-items": "center" }}>
      <div {...visuallyHiddenProps()}>
        <input {...inputProps()} {...focusProps()} ref={ref} />
      </div>
      <svg width={24} height={24} aria-hidden="true" style={{ "margin-right": 4 }}>
        <circle
          cx={12}
          cy={12}
          r={8 - strokeWidth() / 2}
          fill="none"
          stroke={isSelected() ? "orange" : "gray"}
          stroke-width={strokeWidth()}
        />
        {isFocusVisible() && (
          <circle cx={12} cy={12} r={11} fill="none" stroke="orange" stroke-width={2} />
        )}
      </svg>
      {props.children}
    </label>
  );
}

function App() {
  return (
    <RadioGroup label="Favorite pet">
      <Radio value="dogs">Dogs</Radio>
      <Radio value="cats">Cats</Radio>
    </RadioGroup>
  );
}
```

### Internationalization

#### RTL

In right-to-left languages, the radio group and radio buttons should be mirrored. Ensure that your CSS accounts for this.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
