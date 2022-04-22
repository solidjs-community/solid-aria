<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Label" alt="Solid Aria - Label">
</p>

# @solid-aria/label

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/label?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/label)
[![version](https://img.shields.io/npm/v/@solid-aria/label?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/label)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Labels provide context for user inputs.

## Installation

```bash
npm install @solid-aria/label
# or
yarn add @solid-aria/label
# or
pnpm add @solid-aria/label
```

## `createLabel`

Provides the accessibility implementation for labels and their associated elements. It associates a label with a field and automatically handles creating an id for the field and associates the label with it.

### How to use it

```tsx
import { createLabel } from "@solid-aria/label";
import { AriaLabelProps } from "@solid-aria/types";

interface ColorFieldProps extends AriaLabelProps {
  // your component specific props
}

function ColorField(props: ColorFieldProps) {
  const { labelProps, fieldProps } = createLabel(props);

  return (
    <>
      <label {...labelProps()}>{props.label}</label>
      <select {...fieldProps()}>
        <option>Indigo</option>
        <option>Maroon</option>
        <option>Chartreuse</option>
      </select>
    </>
  );
}

function App() {
  return <ColorField label="Favorite color" />;
}
```

By default, `createLabel` assumes that the label is a native HTML label element. However, if you are labeling a non-native form element, be sure to use an element other than a `<label>` and set the `labelElementType` prop appropriately.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
