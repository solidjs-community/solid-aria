<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Separator" alt="Solid Aria - Separator">
</p>

# @solid-aria/separator

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/separator?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/separator)
[![version](https://img.shields.io/npm/v/@solid-aria/separator?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/separator)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

A separator is a visual divider between two groups of content, e.g. groups of menu items or sections of a page.

- [`createSeparator`](#createseparator) - Provides the accessibility implementation for a separator.

## Installation

```bash
npm install @solid-aria/separator
# or
yarn add @solid-aria/separator
# or
pnpm add @solid-aria/separator
```

## `createSeparator`

### Features

Horizontal separators can be built with the HTML `<hr>` element. However, there is no HTML element for a vertical separator. `createSeparator` helps achieve accessible separators that can be styled as needed.

- Support for horizontal and vertical orientation
- Support for HTML `<hr>` element or a custom element type

### How to use it

This example shows how create both a horizontal and a vertical oriented separator.

```tsx
import { AriaSeparatorProps, createSeparator } from "@solid-aria/separator";

function Separator(props: AriaSeparatorProps) {
  const { separatorProps } = createSeparator(props);

  return (
    <div
      {...separatorProps}
      style={{
        background: "gray",
        width: props.orientation === "vertical" ? "1px" : "100%",
        height: props.orientation === "vertical" ? "100%" : "1px",
        margin: props.orientation === "vertical" ? "0 5px" : "5px 0"
      }}
    />
  );
}

function App() {
  return (
    <>
      <div style={{ display: "flex", "flex-direction": "column" }}>
        Content above
        <Separator />
        Content below
      </div>
      <div
        style={{
          display: "flex",
          "flex-direction": "row",
          "margin-top": "20px",
          height: "40px",
          "align-items": "center"
        }}
      >
        Content left
        <Separator orientation="vertical" />
        Content right
      </div>
    </>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
