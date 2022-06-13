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

This example does not do any advanced popover positioning or portaling to escape its visual container.

In addition, see [`createListBox`](../listbox/) for examples of sections (option groups), and more complex options.

```tsx

```

### Internationalization

`createSelect` and `createListBox` handle some aspects of internationalization automatically. For example, type to select is implemented with an `Intl.Collator` for internationalized string matching. You are responsible for localizing all labels and option content that is passed into the select.

#### RTL

In right-to-left languages, the select should be mirrored. Ensure that your CSS accounts for this.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
