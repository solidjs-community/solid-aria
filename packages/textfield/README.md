<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=TextField" alt="Solid Aria - TextField">
</p>

# @solid-aria/textfield

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/textfield?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/textfield)
[![version](https://img.shields.io/npm/v/@solid-aria/textfield?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/textfield)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

TextFields are text inputs that allow users to input custom text entries with a keyboard.

- [`createTextField`](#createtextfield) - Provides the behavior and accessibility implementation for a text field.

## Installation

```bash
npm install @solid-aria/textfield
# or
yarn add @solid-aria/textfield
# or
pnpm add @solid-aria/textfield
```

## `createTextField`

### Features

Text fields can be built with `<input>` or `<textarea>` and `<label>` elements, but you must manually ensure that they are semantically connected via ids for accessibility. `createTextField` helps automate this, and handle other accessibility features while allowing for custom styling.

- Built with a native `<input>` or `<textarea>` element
- Visual and ARIA labeling support
- Change, clipboard, composition, selection, and input event support
- Required and invalid states exposed to assistive technology via ARIA
- Support for description and error message help text linked to the input via ARIA

### How to use it

```tsx
import { AriaTextFieldProps, createTextField } from "@solid-aria/textfield";

function TextField(props: AriaTextFieldProps<"input">) {
  let ref: HTMLInputElement | undefined;

  const { labelProps, inputProps, descriptionProps, errorMessageProps } = createTextField(
    props,
    () => ref
  );

  return (
    <div style={{ display: "flex", "flex-direction": "column", width: "200px" }}>
      <label {...labelProps}>{props.label}</label>
      <input {...inputProps} ref={ref} />
      <Show when={props.description}>
        <div {...descriptionProps} style={{ "font-size": "12px" }}>
          {props.description}
        </div>
      </Show>
      <Show when={props.errorMessage}>
        <div {...errorMessageProps} style={{ color: "red", "font-size": "12px" }}>
          {props.errorMessage}
        </div>
      </Show>
    </div>
  );
}

function App() {
  return (
    <>
      <TextField label="Email" />
      <TextField
        label="Email"
        description="Enter an email for us to contact you about your order."
      />
      <TextField label="Email" errorMessage="Please enter a valid email address." />
    </>
  );
}
```

### Internationalization

#### RTL

In right-to-left languages, text fields should be mirrored. Ensure that your CSS accounts for this.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
