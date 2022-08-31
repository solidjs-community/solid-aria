<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=%20" alt="Solid ARIA">
</p>

# Solid Aria

A library of high-quality primitives that help you build accessible user interfaces with SolidJS.

> ⚠️ Solid Aria is in early stage and **not ready** for production ⚠️

## Contribitors

> **Note**
> <b>We're looking for contributors!</b> Solid Aria has ported more than half of all features and tests to reach parity with React Aria. It has excellent foundations but could use support to push it to completion.

There are opportunities for short and long-term contributors. Currently the need includes focusing on the `collection` package which supports `listbox`, `menu`, `select` etc. This package has been mostly ported but needs to be tested and validated. To get involved reach out via Github Issue or join us on [our SolidJS dedicated Discord channel](https://discord.com/channels/722131463138705510/967415193233670174).

## All in one package

[@solid-aria/primitives](./packages/primitives/) - Export all Solid Aria primitives in a single convenient package.

## Separate packages

### General

- [button](./packages/button/) - Provides the behavior and accessibility implementation for button and toggle button components.

### Data entry

- [checkbox](./packages/checkbox/) - Provides the behavior and accessibility implementation for checkbox and checkbox group components.
- [label](./packages/label/) - Provides the behavior and accessibility implementation for labels and their associated elements.
- [radio](./packages/radio/) - Provides the behavior and accessibility implementation for radio and radio group components.
- [select](./packages/select/) - Provides the behavior and accessibility implementation for select component.
- [switch](./packages/switch/) - Provides the behavior and accessibility implementation for switch component.
- [textfield](./packages/textfield/) - Provides the behavior and accessibility implementation for text field component.
- [toggle](./packages/toggle/) - Handles interactions for toggle elements, e.g. checkboxes and switches.

### Data display

- [accordion](./packages/accordion/) - Provides the accessibility implementation for an accordion.
- [listbox](./packages/listbox/) - Provides the behavior and accessibility implementation for listbox component.
- [separator](./packages/separator/) - Provides the accessibility implementation for a separator.

### Navigation

- [breadcrumbs](./packages/breadcrumbs/) - Provides the behavior and accessibility implementation for a breadcrumbs component.
- [link](./packages/link/) - Provides the behavior and accessibility implementation for a link component.

### Feedback

- [meter](./packages/meter/) - Provides the accessibility implementation for a meter component.
- [progress](./packages/progress/) - Provides the accessibility implementation for a progress bar component.

### Overlay

- [dialog](./packages/dialog/) - Provides the behavior and accessibility implementation for a dialog component.
- [menu](./packages/menu/) - Provides the behavior and accessibility implementation for a menu component.
- [overlays](./packages/overlays/) - Provides the behavior and accessibility implementation for overlay components such as dialogs, popovers, and menus.

### Collection

- [collection](./packages/collection/) - Primitives for dealing with collection of items.
- [list](./packages/list/) - Primitives for managing list collections.
- [selection](./packages/selection/) - Primitives for managing selection in collections.
- [tree](./packages/tree/) - Primitives for managing tree collections.

### Interaction

- [focus](./packages/focus/) - Primitives for dealing with focus rings and focus management.
- [interactions](./packages/interactions/) - Primitives for dealing with user interactions like press, hover, etc.

### Utility

- [i18n](./packages/i18n/) - Primitives for dealing with locale and layout direction.
- [visually-hidden](./packages/visually-hidden/) - Hides its children visually, while keeping content visible to screen readers.

## Roadmap

- [x] Accordion
- [x] Breadcrumbs
- [x] Button
- [x] Checkbox
- [x] Dialog
- [x] Label
- [x] Link
- [x] Listbox
- [x] Menu
- [x] Meter
- [x] Overlays
- [x] Progress
- [x] Radio
- [x] Select
- [x] Separator
- [x] Switch
- [x] TextField
- [x] Toggle
- [x] Visually-hidden

- [ ] AutoComplete
- [ ] Calendar
- [ ] Combobox
- [ ] DatePicker
- [ ] List
- [ ] LiveAnnouncer
- [ ] NumberField
- [ ] Pagination
- [ ] SearchField
- [ ] Slider
- [ ] Table
- [ ] Tabs
- [ ] Toast
- [ ] Tooltip
- [ ] Virtualizer

## Acknowledgment

This project is inspired by Adobe's [React Spectrum Libraries](https://github.com/adobe/react-spectrum).
