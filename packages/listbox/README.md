<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Listbox" alt="Solid Aria - Listbox">
</p>

# @solid-aria/listbox

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/listbox?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/listbox)
[![version](https://img.shields.io/npm/v/@solid-aria/listbox?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/listbox)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Listbox displays a list of options and allows a user to select one or more of them.

## Installation

```bash
npm install @solid-aria/listbox
# or
yarn add @solid-aria/listbox
# or
pnpm add @solid-aria/listbox
```

## `createListBox`

Provides the behavior and accessibility implementation for a listbox component.

### Features

A listbox can be built using the `<select>` and `<option>` HTML elements, but this is not possible to style consistently cross browser. `createListBox` helps achieve accessible listbox components that can be styled as needed.

Note: `createListBox` only handles the list itself.

- Exposed to assistive technology as a listbox using ARIA
- Support for single or multiple selection
- Support for disabled items
- Support for sections
- Labeling support for accessibility
- Support for mouse, touch, and keyboard interactions
- Tab stop focus management
- Keyboard navigation support including arrow keys, home/end, page up/down, select all, and clear
- Automatic scrolling support during keyboard navigation
- Typeahead to allow focusing options by typing text

### How to use it

This example uses HTML `<ul>` and `<li>` elements to represent the list, and applies props from `createListBox` and `createListBoxOption`.

```tsx
import { ForItems, Item } from "@solid-aria/collection";
import { createFocusRing } from "@solid-aria/focus";
import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  createListBox,
  createListBoxOption
} from "@solid-aria/listbox";

import { combineProps } from "@solid-primitives/props";

import { ParentProps } from "solid-js";

function ListBox(props: AriaListBoxProps) {
  let ref: HTMLUListElement | undefined;

  const { ListBoxProvider, listBoxProps, labelProps, state } = createListBox(props, () => ref);

  return (
    <ListBoxProvider>
      <div {...labelProps}>{props.label}</div>
      <ul
        {...listBoxProps}
        ref={ref}
        style={{
          padding: 0,
          margin: "5px 0",
          "list-style": "none",
          border: "1px solid gray",
          "max-width": "250px"
        }}
      >
        <ForItems in={state.collection()}>
          {item => <Option key={item().key}>{item().children}</Option>}
        </ForItems>
      </ul>
    </ListBoxProvider>
  );
}

function Option(props: ParentProps<AriaListBoxOptionProps>) {
  let ref: HTMLLIElement | undefined;

  const { optionProps, isSelected } = createListBoxOption(props, () => ref);

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  const { isFocusVisible, focusProps } = createFocusRing();

  const rootProps = combineProps(optionProps, focusProps);

  return (
    <li
      {...rootProps}
      ref={ref}
      style={{
        background: isSelected() ? "blueviolet" : "transparent",
        color: isSelected() ? "white" : null,
        padding: "2px 5px",
        outline: isFocusVisible() ? "2px solid orange" : "none"
      }}
    >
      {props.children}
    </li>
  );
}

function App() {
  return (
    <ListBox label="Choose an option" selectionMode="single">
      <Item key="one">One</Item>
      <Item key="two">Two</Item>
      <Item key="three">Three</Item>
    </ListBox>
  );
}
```

### Listbox sections

This example shows how a listbox can support sections with separators and headings using props from `createListBoxSection`. This is accomplished using three extra elements: an `<li>` to contain the heading `<span>` element, and a `<ul>` to contain the child items. This structure is necessary to ensure HTML semantics are correct.

```tsx
import { ForItems, Item, Section } from "@solid-aria/collection";
import { createFocusRing } from "@solid-aria/focus";
import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  AriaListBoxSectionProps,
  createListBox,
  createListBoxOption,
  createListBoxSection
} from "@solid-aria/listbox";

import { combineProps } from "@solid-primitives/props";

import { ParentProps, Show } from "solid-js";

function ListBox(props: AriaListBoxProps) {
  let ref: HTMLUListElement | undefined;

  const { ListBoxProvider, listBoxProps, labelProps, state } = createListBox(props, () => ref);

  return (
    <ListBoxProvider>
      <div {...labelProps}>{props.label}</div>
      <ul
        {...listBoxProps}
        ref={ref}
        style={{
          padding: 0,
          margin: "5px 0",
          "list-style": "none",
          border: "1px solid gray",
          "max-width": "250px"
        }}
      >
        <ForItems in={state.collection()}>
          {section => (
            <ListBoxSection heading={section().title}>
              <ForItems in={section().childNodes}>
                {item => <Option key={item().key}>{item().children}</Option>}
              </ForItems>
            </ListBoxSection>
          )}
        </ForItems>
      </ul>
    </ListBoxProvider>
  );
}

function ListBoxSection(props: ParentProps<AriaListBoxSectionProps>) {
  const { itemProps, headingProps, groupProps } = createListBoxSection(props);

  return (
    <li {...itemProps}>
      <Show when={props.heading}>
        <span
          {...headingProps}
          style={{
            "font-weight": "bold",
            "font-size": "1.1em",
            padding: "2px 5px"
          }}
        >
          {props.heading}
        </span>
      </Show>
      <ul
        {...groupProps}
        style={{
          padding: 0,
          "list-style": "none"
        }}
      >
        {props.children}
      </ul>
    </li>
  );
}

function Option(props: ParentProps<AriaListBoxOptionProps>) {
  let ref: HTMLLIElement | undefined;

  const { optionProps, isSelected } = createListBoxOption(props, () => ref);

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  const { isFocusVisible, focusProps } = createFocusRing();

  const rootProps = combineProps(optionProps, focusProps);

  return (
    <li
      {...rootProps}
      ref={ref}
      style={{
        background: isSelected() ? "blueviolet" : "transparent",
        color: isSelected() ? "white" : null,
        padding: "2px 5px",
        outline: isFocusVisible() ? "2px solid orange" : "none"
      }}
    >
      {props.children}
    </li>
  );
}

function App() {
  return (
    <ListBox label="Choose an option" selectionMode="multiple">
      <Section key="section-one" title="Section 1">
        <Item key="one">One</Item>
        <Item key="two">Two</Item>
        <Item key="three">Three</Item>
      </Section>
      <Section key="section-two" title="Section 2">
        <Item key="four">Four</Item>
        <Item key="five">Five</Item>
        <Item key="six">Six</Item>
      </Section>
    </ListBox>
  );
}
```

### Internationalization

`createListBox` handles some aspects of internationalization automatically. For example, type to select is implemented with an `Intl.Collator` for internationalized string matching. You are responsible for localizing all labels and option content that is passed into the listbox.

#### RTL

In right-to-left languages, the listbox options should be mirrored. Ensure that your CSS accounts for this.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
