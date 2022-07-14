<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Accordion" alt="Solid Aria - Accordion">
</p>

# @solid-aria/accordion

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/accordion?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/accordion)
[![version](https://img.shields.io/npm/v/@solid-aria/accordion?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/accordion)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Accordion display a list of high-level options that can expand/collapse to reveal more information.

- [`createAccordion` and `createAccordionItem`](#createaccordion-and-createaccordionitem) - Provides the behavior and accessibility implementation for an accordion component.

## Installation

```bash
npm install @solid-aria/accordion
# or
yarn add @solid-aria/accordion
# or
pnpm add @solid-aria/accordion
```

## `createAccordion` and `createAccordionItem`

Provides the behavior and accessibility implementation for an accordion component.

### Features

An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. `createAccordion` and `createAccordionItem` help implement these in an accessible way.

- Exposed to assistive technology using ARIA
- Support for disabled items
- Labeling support for accessibility
- Support for mouse, touch, and keyboard interactions
- Keyboard navigation support including arrow keys and home/end

### How to use it

```tsx
import {
  AriaAccordionItemProps,
  AriaAccordionProps,
  createAccordion,
  createAccordionItem
} from "@solid-aria/accordion";
import { ForItems, Item } from "@solid-aria/collection";
import { filterDOMProps } from "@solid-aria/utils";

import { createMemo, mergeProps } from "solid-js";

function AccordionItem(props: AriaAccordionItemProps) {
  let ref: HTMLButtonElement | undefined;

  const { buttonProps, regionProps, isExpanded } = createAccordionItem(props, () => ref);

  return (
    <div>
      <h3 style={{ margin: 0, padding: 0 }}>
        <button
          {...buttonProps}
          ref={ref}
          style={{
            appearance: "none",
            border: "none",
            display: "block",
            margin: 0,
            padding: "1em 1.5em",
            "text-align": "left",
            width: "100%"
          }}
        >
          {props.item.rendered()}
        </button>
      </h3>
      <div
        {...regionProps}
        style={{
          display: isExpanded() ? "block" : "none",
          margin: 0,
          padding: "1em 1.5em"
        }}
      >
        {props.item.rendered()}
      </div>
    </div>
  );
}

function Accordion(props: AriaAccordionProps) {
  let ref: HTMLDivElement | undefined;

  const { AccordionProvider, accordionProps, state } = createAccordion(props, () => ref);

  const domProps = createMemo(() => filterDOMProps(props));

  const rootProps = mergeProps(domProps, accordionProps);

  return (
    <div
      {...rootProps}
      ref={ref}
      style={{
        margin: 0,
        padding: 0,
        border: "2px solid gray",
        width: "10rem"
      }}
    >
      <AccordionProvider>
        <ForItems in={state.collection()}>{item => <AccordionItem item={item()} />}</ForItems>
      </AccordionProvider>
    </div>
  );
}

function App() {
  return (
    <Accordion>
      <Item key="one" title="Section One">
        <span>Content One</span>
      </Item>
      <Item key="two" title="Section Two">
        <span>Content Two</span>
      </Item>
      <Item key="three" title="Section Three">
        <span>Content Three</span>
      </Item>
    </Accordion>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
