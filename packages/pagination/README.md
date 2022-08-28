<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Pagination" alt="Solid Aria - Pagination">
</p>

# @solid-aria/pagination

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/pagination?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/pagination)
[![version](https://img.shields.io/npm/v/@solid-aria/pagination?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/pagination)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

A pagination allows the user to select a specific page from a range of pages.

- `createPagination` - Provides the behavior and accessibility implementation for a pagination component.
- `createPaginationState`: Provides state management for a pagination component

## Installation

```bash
npm install @solid-aria/pagination
# or
yarn add @solid-aria/pagination
# or
pnpm add @solid-aria/pagination
```

## `createPaginationState`

Provides state management for a pagination component.

### How to use it

```typescript
import { createPaginationState } from "@solid-aria/pagination";

const state = createPaginationState({
  state: 1,
  onChange() {
    // do something
  }
});

// Increment page by 1
state.onIncrement();

// Decrement apge by 1
state.onDecrement();

// Get latest value
state.value();

// Set new page value
state.onChange(10);
```

## `createPagination`

Provides the behavior and accessibility implementation for a pagination component.

### Features

- Accessibility and behavior of page navigation buttons and page text input.

### How to use it

This example use native buttons with [@solid-aria/button](../button) to handle the behavior of the
page navigation buttons.
This mean that the `onPress` property will be bound automatically.

[@solid-aria/i18n](../i18n) will be used to handle the `direction` of the buttons in base of the locale. Also,
each button will automatically have the `aria-label` property translated by the current locale.

```typescript jsx
import { createPagination, createPaginationState } from "@solid-aria/pagination";
import { useLocale } from "@solid-aria/i18n";
import { createButton } from "@solid-aria/button";
import { mergeProps } from "solid-js";

function Pagination(props: PaginationBase) {
  let prevButtonRef: HTMLButtonElement | undefined;
  let nextButtonRef: HTMLButtonElement | undefined;
  // Handle the default value if not present
  props = mergeProps({ defaultValue: 5 }, props);

  const state = createPaginationState(props);
  // Get props for previous button, next button and text input
  const { prevButtonProps, nextButtonProps, textProps } = createPagination(props, state);
  // Retrieve the current locale to handle the direction
  const locale = useLocale();

  // createButton ensures that the `onPress` property present
  // in prevButtonProps is handled automatically.
  const { buttonProps: resolvedPrevButtonProps } = createButton(
    mergeProps(prevButtonProps, {
      get isDisabled() {
        return props.value === 1;
      }
    }),
    () => prevButtonRef
  );

  const { buttonProps: resolvedNextButtonProps } = createButton(
    mergeProps(nextButtonProps, {
      get isDisabled() {
        return props.value === props.maxValue;
      }
    }),
    () => prevButtonRef
  );

  return (
    <div>
      <nav>
        <button {...pagePrevButtonProps} ref={prevButtonRef}>
          {direction() === "rtl" ? ">" : "<"}
        </button>

        <input
          {...textProps}
          value={state.value()}
          onChange={evt => state.onChange(evt.currentTarget?.value)}
        />

        <button {...pageNextButtonProps} ref={nextButtonRef}>
          {direction() === "rtl" ? "<" : ">"}
        </button>
      </nav>
      <span>
        Page: {state.value()} / {maxValue()}
      </span>
    </>
  )
}

function Example() {
  const [page, setPage] = createSignal(1),
    maxValue = 20;

  return (
    <Pagination
      value={page()}
      onChange={setPage}
      maxValue={maxValue}
      onNext={value => console.log('Next', e)}
      onPrevious={value => console.log('Previous', e)}
    />
  )
}


function App() {
  return (
    <Example />
  )
}
```

## Demo

You can use this template for publishing your demo on
CodeSandbox: https://codesandbox.io/s/solid-aria-demo-template-sz95h

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
