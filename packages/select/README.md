<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Select" alt="Solid Aria - Select">
</p>

# @solid-aria/select

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/select?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/select)
[![version](https://img.shields.io/npm/v/@solid-aria/select?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/select)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Select displays a collapsible list of options and allows a user to select one of them.

- [`createSelect`](#createselect) - Provides the behavior and accessibility implementation for a select component.

## Installation

```bash
npm install @solid-aria/select
# or
yarn add @solid-aria/select
# or
pnpm add @solid-aria/select
```

## `createSelect`

### Features

A select can be built using the `<select>` and `<option>` HTML elements, but this is not possible to style consistently cross browser, especially the options. `createSelect` helps achieve accessible select components that can be styled as needed without compromising on high quality interactions.

- Exposed to assistive technology as a button with a `listbox` popup using ARIA (combined with [`createListBox`](../listbox/))
- Support for selecting a single option
- Support for disabled options
- Support for sections
- Labeling support for accessibility
- Support for description and error message help text linked to the input via ARIA
- Support for mouse, touch, and keyboard interactions
- Tab stop focus management
- Keyboard support for opening the listbox using the arrow keys, including automatically focusing the first or last item accordingly
- Typeahead to allow selecting options by typing text, even without opening the listbox
- Browser autofill integration via a hidden native `<select>` element
- Support for mobile form navigation via software keyboard
- Mobile screen reader listbox dismissal support

### How to use it

This example uses a `<button>` element for the trigger, with a `<span>` inside to hold the value, and another for the dropdown arrow icon (hidden from screen readers with aria-hidden). A `<HiddenSelect>` is used to render a hidden native `<select>`, which enables browser form autofill support.

The listbox popup uses `createListBox` and `createListBoxOption` to render the list of options. In addition, a `<FocusScope>` is used to automatically restore focus to the trigger when the popup closes. A hidden `<DismissButton>` is added at the start and end of the popup to allow screen reader users to dismiss the popup.

The `Popover` component is used to contain the popup listbox for the Select. It can be shared between many other components, including ComboBox, Menu, Dialog, and others. See [`createOverlayTrigger`](../overlays/) for more examples of popovers.

The `ListBox` and `Option` components are used to show the list of options. They can also be shared with other components like a ComboBox. See [`createListBox`](../listbox/) for more examples, including sections and more complex items.

This example does not do any advanced popover positioning or portaling to escape its visual container.

```tsx
import { createButton } from "@solid-aria/button";
import { ForItems, Item } from "@solid-aria/collection";
import { FocusScope } from "@solid-aria/focus";
import { ListState } from "@solid-aria/list";
import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  createListBox,
  createListBoxOption
} from "@solid-aria/listbox";
import { AriaOverlayProps, createOverlay, DismissButton } from "@solid-aria/overlays";
import { AriaSelectProps, createSelect, HiddenSelect } from "@solid-aria/select";
import { ParentProps, Show } from "solid-js";

function Popover(props: ParentProps<AriaOverlayProps>) {
  let ref: HTMLDivElement | undefined;

  // Handle events that should cause the popup to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  const { overlayProps } = createOverlay(
    {
      isOpen: props.isOpen,
      onClose: props.onClose,
      shouldCloseOnBlur: true,
      isDismissable: true
    },
    () => ref
  );

  // Add a hidden <DismissButton> component at the end of the popover
  // to allow screen reader users to dismiss the popup easily.
  return (
    <FocusScope restoreFocus>
      <div
        {...overlayProps}
        ref={ref}
        style={{
          position: "absolute",
          width: "100%",
          border: "1px solid gray",
          background: "lightgray",
          "margin-top": "4px"
        }}
      >
        {props.children}
        <DismissButton onDismiss={props.onClose} />
      </div>
    </FocusScope>
  );
}

function ListBox(props: AriaListBoxProps & { state: ListState }) {
  let ref: HTMLUListElement | undefined;

  const { ListBoxProvider, listBoxProps } = createListBox(props, () => ref, props.state);

  return (
    <ListBoxProvider>
      <ul
        {...listBoxProps}
        ref={ref}
        style={{
          margin: 0,
          padding: 0,
          "list-style": "none",
          "max-height": "150px",
          overflow: "auto"
        }}
      >
        <ForItems in={props.state.collection()}>
          {item => <Option key={item().key}>{item().children}</Option>}
        </ForItems>
      </ul>
    </ListBoxProvider>
  );
}

function Option(props: ParentProps<AriaListBoxOptionProps>) {
  let ref: HTMLLIElement | undefined;

  const { optionProps, isSelected, isFocused } = createListBoxOption(props, () => ref);

  return (
    <li
      {...optionProps}
      ref={ref}
      style={{
        background: isSelected() ? "blueviolet" : isFocused() ? "gray" : "white",
        color: isSelected() ? "white" : "black",
        padding: "2px 5px",
        outline: "none",
        cursor: "pointer"
      }}
    >
      {props.children}
    </li>
  );
}

function Select(props: AriaSelectProps) {
  let ref: HTMLButtonElement | undefined;

  // Get props for child elements from useSelect
  const { labelProps, triggerProps, valueProps, menuProps, state } = createSelect(props, () => ref);

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = createButton(triggerProps, () => ref);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div {...labelProps}>{props.label}</div>
      <HiddenSelect state={state} triggerRef={ref} label={props.label} name={props.name} />
      <button {...buttonProps} ref={ref} style={{ height: "30px", "font-size": "14px" }}>
        <span {...valueProps}>{state.selectedItem()?.children ?? "Select an option"}</span>
        <span aria-hidden="true" style={{ "padding-left": "5px" }}>
          ▼
        </span>
      </button>
      <Show when={state.isOpen()}>
        <Popover isOpen={state.isOpen()} onClose={state.close}>
          <ListBox {...menuProps} state={state} />
        </Popover>
      </Show>
    </div>
  );
}

function App() {
  return (
    <Select label="Favorite Color">
      <Item key="red">Red</Item>
      <Item key="orange">Orange</Item>
      <Item key="yellow">Yellow</Item>
      <Item key="green">Green</Item>
      <Item key="blue">Blue</Item>
      <Item key="purple">Purple</Item>
      <Item key="black">Black</Item>
      <Item key="white">White</Item>
      <Item key="lime">Lime</Item>
      <Item key="fuchsia">Fuchsia</Item>
    </Select>
  );
}
```

### Internationalization

`createSelect` and `createListBox` handle some aspects of internationalization automatically. For example, type to select is implemented with an `Intl.Collator` for internationalized string matching. You are responsible for localizing all labels and option content that is passed into the select.

#### RTL

In right-to-left languages, the select should be mirrored. Ensure that your CSS accounts for this.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
