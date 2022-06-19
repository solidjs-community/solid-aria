<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Progress" alt="Solid Aria - Progress">
</p>

# @solid-aria/progress

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/progress?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/progress)
[![version](https://img.shields.io/npm/v/@solid-aria/progress?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/progress)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Progress bars show either determinate or indeterminate progress of an operation over time.

- [`createProgressBar`](#createprogressbar) - Provides the accessibility implementation for a progress bar component.

## Installation

```bash
npm install @solid-aria/progress
# or
yarn add @solid-aria/progress
# or
pnpm add @solid-aria/progress
```

## `createProgressBar`

### Features

The `<progress>` HTML element can be used to build a progress bar, however it is very difficult to style cross browser. `createProgressBar` helps achieve accessible progress bars and spinners that can be styled as needed.

- Exposed to assistive technology as a progress bar via ARIA
- Labeling support for accessibility
- Internationalized number formatting as a percentage or value
- Determinate and indeterminate progress support

### How to use it

```tsx
import { AriaProgressBarProps, createProgressBar } from "@solid-aria/progress";
import { createMemo, Show } from "solid-js";

function ProgressBar(props: AriaProgressBarProps) {
  const { progressBarProps, labelProps, percentage } = createProgressBar(props);

  const barWidth = createMemo(() => `${Math.round(percentage() * 100)}%`);

  return (
    <div {...progressBarProps} style={{ width: "200px" }}>
      <div style={{ display: "flex", "justify-content": "space-between" }}>
        <Show when={props.label}>
          <span {...labelProps}>{props.label}</span>
          <span>{progressBarProps["aria-valuetext"]}</span>
        </Show>
      </div>
      <div style={{ height: "10px", background: "gray" }}>
        <div style={{ width: barWidth(), height: "10px", background: "orange" }} />
      </div>
    </div>
  );
}

function App() {
  return <ProgressBar label="Loading..." value={30} />;
}
```

### Indeterminate state

Progress bars can represent an indeterminate operation. They may also be used to represent progress visually as a circle rather than as a line. The following example shows an indeterminate progress bar visualized as a circular spinner using SVG.

```tsx
import { createProgressBar } from "@solid-aria/progress";

function Spinner() {
  const { progressBarProps } = createProgressBar({
    isIndeterminate: true,
    "aria-label": "Loading..."
  });

  const center = 16;
  const strokeWidth = 4;
  const r = 16 - strokeWidth;
  const c = 2 * r * Math.PI;
  const offset = c - (1 / 4) * c;

  return (
    <svg
      {...progressBarProps}
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      stroke-width={strokeWidth}
    >
      <circle cx={center} cy={center} r={r} stroke="gray" />
      <circle
        cx={center}
        cy={center}
        r={r}
        stroke="orange"
        stroke-dasharray={c.toString()}
        stroke-dashoffset={offset}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          begin="0s"
          dur="1s"
          from="0 16 16"
          to="360 16 16"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

function App() {
  return <Spinner />;
}
```

### Internationalization

#### Value formatting

`createProgressBar` will handle localized formatting of the value label for accessibility automatically. This is returned in the `aria-valuetext` prop in `progressBarProps`. You can use this to create a visible label if needed and ensure that it is formatted correctly. The number formatting can also be controlled using the `formatOptions` prop.

#### RTL

In right-to-left languages, the progress bar should be mirrored. Ensure that your CSS accounts for this.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
