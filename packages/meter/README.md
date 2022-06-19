<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Meter" alt="Solid Aria - Meter">
</p>

# @solid-aria/meter

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/meter?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/meter)
[![version](https://img.shields.io/npm/v/@solid-aria/meter?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/meter)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Meters represent a quantity within a known range, or a fractional value.

- [`createMeter`](#createmeter) - Provides the accessibility implementation for a meter component.

## Installation

```bash
npm install @solid-aria/meter
# or
yarn add @solid-aria/meter
# or
pnpm add @solid-aria/meter
```

## `createMeter`

### Features

The `<meter>` HTML element can be used to build a meter, however it is very difficult to style cross browser. `createMeter` helps achieve accessible meters that can be styled as needed.

Meters are similar to progress bars, but represent a quantity as opposed to progress over time. See the [`createProgressBar`](../progress/) primitive for more details about progress bars.

- Exposed to assistive technology as a `meter` via ARIA, with fallback to `progressbar` where unsupported
- Labeling support for accessibility
- Internationalized number formatting as a percentage or value

### How to use it

```tsx
import { AriaMeterProps, createMeter } from "@solid-aria/meter";
import { Show } from "solid-js/web";

function Meter(props: AriaMeterProps) {
  const { meterProps, labelProps, percentage } = createMeter(props);

  // Calculate the width of the progress bar as a percentage
  const barWidth = `${Math.round(percentage() * 100)}%`;

  return (
    <div {...meterProps} style={{ width: "200px" }}>
      <div style={{ display: "flex", "justify-content": "space-between" }}>
        <Show when={props.label}>
          <span {...labelProps}>{props.label}</span>
          <span>{meterProps["aria-valuetext"]}</span>
        </Show>
      </div>
      <div style={{ height: "10px", background: "gray" }}>
        <div style={{ width: barWidth, height: "10px", background: "green" }} />
      </div>
    </div>
  );
}

function App() {
  return <Meter label="Storage space" value={250} maxValue={1000} />;
}
```

### Internationalization

#### Value formatting

`createMeter` will handle localized formatting of the value label for accessibility automatically. This is returned in the `aria-valuetext` prop in `meterProps`. You can use this to create a visible label if needed and ensure that it is formatted correctly. The number formatting can also be controlled using the `formatOptions` prop.

#### RTL

In right-to-left languages, the meter should be mirrored. Ensure that your CSS accounts for this.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
