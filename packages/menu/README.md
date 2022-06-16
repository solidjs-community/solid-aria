<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Menu" alt="Solid Aria - Menu">
</p>

# @solid-aria/menu

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/menu?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/menu)
[![version](https://img.shields.io/npm/v/@solid-aria/menu?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/menu)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Menu displays a list of actions or options that a user can choose.

- [`createMenu`](#createmenu) - Provides the behavior and accessibility implementation for a menu component.
- [`createMenuTrigger`](#createmenutrigger) - Provides the behavior and accessibility implementation for a menu trigger.

## Installation

```bash
npm install @solid-aria/menu
# or
yarn add @solid-aria/menu
# or
pnpm add @solid-aria/menu
```

## `createMenu`

Provides the behavior and accessibility implementation for a menu component.

### Features

There is no native element to implement a menu in HTML that is widely supported. `createMenu` helps achieve accessible menu components that can be styled as needed.

ℹ️ **Note:** `createMenu` only handles the menu itself. For a dropdown menu, combine with `createMenuTrigger`.

- Exposed to assistive technology as a `menu` with `menuitem` children using ARIA
- Support for single, multiple, or no selection
- Support for disabled items
- Support for sections
- Complex item labeling support for accessibility
- Support for mouse, touch, and keyboard interactions
- Tab stop focus management
- Keyboard navigation support including arrow keys, home/end, page up/down
- Automatic scrolling support during keyboard navigation
- Typeahead to allow focusing items by typing text

### How to use it

This example uses HTML `<ul>` and `<li>` elements to represent the menu with the first item disabled, and applies props from `createMenu` and `createMenuItem`.

```tsx
import { ForItems, Item } from "@solid-aria/collection";
import { AriaMenuItemProps, AriaMenuProps, createMenu, createMenuItem } from "@solid-aria/menu";
import { ParentProps } from "solid-js";

function Menu(props: AriaMenuProps) {
  let ref: HTMLUListElement | undefined;

  // Get props for the menu element
  const { MenuProvider, menuProps, state } = createMenu(props, () => ref);

  return (
    <MenuProvider>
      <ul
        {...menuProps}
        ref={ref}
        style={{
          padding: 0,
          "list-style": "none",
          border: "1px solid gray",
          "max-width": "250px"
        }}
      >
        <ForItems in={state.collection()}>
          {item => (
            <MenuItem key={item().key} onAction={props.onAction}>
              {item().rendered()}
            </MenuItem>
          )}
        </ForItems>
      </ul>
    </MenuProvider>
  );
}

function MenuItem(props: ParentProps<AriaMenuItemProps>) {
  let ref: HTMLLIElement | undefined;

  // Get props for the menu item element
  const { menuItemProps, isFocused, isDisabled } = createMenuItem(props, () => ref);

  return (
    <li
      {...menuItemProps}
      ref={ref}
      style={{
        background: isFocused() ? "gray" : "transparent",
        color: isFocused() ? "white" : null,
        padding: "2px 5px",
        outline: "none",
        cursor: isDisabled() ? "default" : "pointer"
      }}
    >
      {props.children}
    </li>
  );
}

function App() {
  return (
    <Menu onAction={key => alert(key)} aria-label="Actions" disabledKeys={["one"]}>
      <Item key="one">One</Item>
      <Item key="two">Two</Item>
      <Item key="three">Three</Item>
    </Menu>
  );
}
```

### Menu sections

This example shows how a menu can support sections with separators and headings using props from `createMenuSection`. This is accomplished using three extra elements: an `<li>` to contain the heading `<span>` element, and a `<ul>` to contain the child items. This structure is necessary to ensure HTML semantics are correct.

```tsx
import { ForItems, Item, Section } from "@solid-aria/collection";
import {
  AriaMenuItemProps,
  AriaMenuProps,
  AriaMenuSectionProps,
  createMenu,
  createMenuItem,
  createMenuSection
} from "@solid-aria/menu";
import { ParentProps, Show } from "solid-js";

function Menu(props: AriaMenuProps) {
  let ref: HTMLUListElement | undefined;

  // Get props for the menu element
  const { MenuProvider, menuProps, state } = createMenu(props, () => ref);

  return (
    <MenuProvider>
      <ul
        {...menuProps}
        ref={ref}
        style={{
          padding: 0,
          "list-style": "none",
          border: "1px solid gray",
          "max-width": "250px"
        }}
      >
        <ForItems in={state.collection()}>
          {section => (
            <MenuSection heading={section().rendered()}>
              <ForItems in={section().childNodes}>
                {item => (
                  <MenuItem key={item().key} onAction={props.onAction}>
                    {item().rendered()}
                  </MenuItem>
                )}
              </ForItems>
            </MenuSection>
          )}
        </ForItems>
      </ul>
    </MenuProvider>
  );
}

function MenuSection(props: ParentProps<AriaMenuSectionProps>) {
  const { itemProps, headingProps, groupProps } = createMenuSection(props);

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

function MenuItem(props: ParentProps<AriaMenuItemProps>) {
  let ref: HTMLLIElement | undefined;

  // Get props for the menu item element
  const { menuItemProps, isFocused, isDisabled } = createMenuItem(props, () => ref);

  return (
    <li
      {...menuItemProps}
      ref={ref}
      style={{
        background: isFocused() ? "gray" : "transparent",
        color: isFocused() ? "white" : null,
        padding: "2px 5px",
        outline: "none",
        cursor: isDisabled() ? "default" : "pointer"
      }}
    >
      {props.children}
    </li>
  );
}

function App() {
  return (
    <Menu onAction={key => alert(key)} aria-label="Actions">
      <Section key="section1" title="Section 1">
        <Item key="section1-item1">One</Item>
        <Item key="section1-item2">Two</Item>
        <Item key="section1-item3">Three</Item>
      </Section>
      <Section key="section2" title="Section 2">
        <Item key="section2-item1">One</Item>
        <Item key="section2-item2">Two</Item>
        <Item key="section2-item3">Three</Item>
      </Section>
    </Menu>
  );
}
```

## `createMenuTrigger`

Provides the behavior and accessibility implementation for a menu trigger.

### Features

There is no native element to implement a menu in HTML that is widely supported. `createMenuTrigger` combined with `createMenu` helps achieve accessible menu components that can be styled as needed.

- Exposed to assistive technology as a button with a `menu` popup using ARIA (combined with `createMenu`)
- Support for mouse, touch, and keyboard interactions
- Keyboard support for opening the menu using the arrow keys, including automatically focusing the first or last item accordingly

### How to use it

This example shows how to build a menu button using `createMenuTrigger`, `createButton`, and `createMenu`.

The menu popup uses `createMenu` and `createMenuItem` to render the menu and its items. In addition, a `<FocusScope>` is used to automatically restore focus to the trigger when the menu closes. A hidden `<DismissButton>` is added at the start and end of the menu to allow screen reader users to dismiss it easily.

This example does not do any advanced popover positioning or portaling to escape its visual container.

```tsx
import { createButton } from "@solid-aria/button";
import { ForItems, Item } from "@solid-aria/collection";
import { FocusScope } from "@solid-aria/focus";
import { createFocus } from "@solid-aria/interactions";
import {
  AriaMenuItemProps,
  AriaMenuProps,
  AriaMenuTriggerProps,
  createMenu,
  createMenuItem,
  createMenuTrigger
} from "@solid-aria/menu";
import { AriaOverlayProps, createOverlay, DismissButton } from "@solid-aria/overlays";
import { combineProps } from "@solid-primitives/props";
import { createSignal, FlowProps, JSX, ParentProps, Show } from "solid-js";

type MenuButtonProps = FlowProps<AriaMenuTriggerProps & AriaMenuProps & { label: JSX.Element }>;

function MenuButton(props: MenuButtonProps) {
  let ref: HTMLButtonElement | undefined;

  // Get props for the menu trigger and menu elements
  const { menuTriggerProps, menuProps, state } = createMenuTrigger({}, () => ref);

  // Get props for the button based on the trigger props from createMenuTrigger
  const { buttonProps } = createButton(menuTriggerProps, () => ref);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button {...buttonProps} ref={ref} style={{ height: "30px", "font-size": "14px" }}>
        {props.label}
        <span aria-hidden="true" style={{ "padding-left": "5px" }}>
          ▼
        </span>
      </button>
      <Show when={state.isOpen()}>
        <MenuPopup
          {...props}
          {...menuProps}
          autofocus={state.focusStrategy()}
          onClose={() => state.close()}
        />
      </Show>
    </div>
  );
}

function MenuPopup(props: AriaMenuProps & AriaOverlayProps) {
  let ref: HTMLUListElement | undefined;

  // Get props for the menu element
  const { MenuProvider, menuProps, state } = createMenu(props, () => ref);

  // Handle events that should cause the menu to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  let overlayRef: HTMLDivElement | undefined;
  const { overlayProps } = createOverlay(
    {
      onClose: props.onClose,
      shouldCloseOnBlur: true,
      isOpen: true,
      isDismissable: true
    },
    () => overlayRef
  );

  // Wrap in <FocusScope> so that focus is restored back to the
  // trigger when the menu is closed. In addition, add hidden
  // <DismissButton> components at the start and end of the list
  // to allow screen reader users to dismiss the popup easily.
  return (
    <MenuProvider>
      <FocusScope restoreFocus>
        <div {...overlayProps} ref={overlayRef}>
          <DismissButton onDismiss={props.onClose} />
          <ul
            {...menuProps}
            ref={ref}
            style={{
              position: "absolute",
              width: "100%",
              margin: "4px 0 0 0",
              padding: 0,
              "list-style": "none",
              border: "1px solid gray",
              background: "lightgray"
            }}
          >
            <ForItems in={state.collection()}>
              {item => (
                <MenuItem key={item().key} onAction={props.onAction} onClose={props.onClose}>
                  {item().rendered()}
                </MenuItem>
              )}
            </ForItems>
          </ul>
          <DismissButton onDismiss={props.onClose} />
        </div>
      </FocusScope>
    </MenuProvider>
  );
}

function MenuItem(props: ParentProps<AriaMenuItemProps>) {
  let ref: HTMLLIElement | undefined;

  // Get props for the menu item element
  const { menuItemProps } = createMenuItem(props, () => ref);

  // Handle focus events so we can apply highlighted
  // style to the focused menu item
  const [isFocused, setIsFocused] = createSignal(false);
  const { focusProps } = createFocus({ onFocusChange: setIsFocused });

  const rootProps = combineProps(menuItemProps, focusProps);

  return (
    <li
      {...rootProps}
      ref={ref}
      style={{
        background: isFocused() ? "gray" : "transparent",
        color: isFocused() ? "white" : "black",
        padding: "2px 5px",
        outline: "none",
        cursor: "pointer"
      }}
    >
      {props.children}
    </li>
  );
}

function App() {
  return (
    <MenuButton label="Actions" onAction={key => alert(key)}>
      <Item key="copy">Copy</Item>
      <Item key="cut">Cut</Item>
      <Item key="paste">Paste</Item>
    </MenuButton>
  );
}
```

### Internationalization

`createMenu` handles some aspects of internationalization automatically. For example, type to select is implemented with an `Intl.Collator` for internationalized string matching. You are responsible for localizing all menu item labels for content that is passed into the menu.

#### RTL

In right-to-left languages, the menu items should be mirrored. Ensure that your CSS accounts for this.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
