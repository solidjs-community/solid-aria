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

```

### Listbox sections

This example shows how a listbox can support sections with separators and headings using props from `createListBoxSection`. This is accomplished using three extra elements: an `<li>` to contain the heading `<span>` element, and a `<ul>` to contain the child items. This structure is necessary to ensure HTML semantics are correct.

```tsx

```

### Internationalization

`createListBox` handles some aspects of internationalization automatically. For example, type to select is implemented with an `Intl.Collator` for internationalized string matching. You are responsible for localizing all labels and option content that is passed into the listbox.

#### RTL

In right-to-left languages, the listbox options should be mirrored. Ensure that your CSS accounts for this.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
