<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Interactions" alt="Solid Aria - Interactions">
</p>

# @solid-aria/interactions

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/interactions?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/interactions)
[![version](https://img.shields.io/npm/v/@solid-aria/interactions?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/interactions)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

A collection of low level user interactions primitives.

- [`createPress`](#createpress) - Handles press interactions across mouse, touch, keyboard, and screen readers.
- [`createLongPress`](#createlongpress) - Handles long press interactions across mouse and touch devices.
- [`createHover`](#createhover) - Handles pointer hover interactions for an element.
- [`createFocus`](#createfocus) - Handles focus events for the immediate target.
- [`createFocusWithin`](#createfocuswithin) - Handles focus events for the target and its descendants.
- [`createFocusVisible`](#createfocusvisible) - Manages focus visible state for the page, and subscribes individual components for updates.
- [`createKeyborad`](#createkeyborad) - Handles keyboard interactions for a focusable element.
- [`createInteractOutside`](#createinteractoutside) - Handles interaction outside a given element.

## Installation

```bash
npm install @solid-aria/interactions
# or
yarn add @solid-aria/interactions
# or
pnpm add @solid-aria/interactions
```

## `createPress`

Handles press interactions across mouse, touch, keyboard, and screen readers. It normalizes behavior across browsers and platforms, and handles many nuances of dealing with pointer and keyboard events.

### Features

`createPress` handles press interactions across mouse, touch, keyboard, and screen readers. A press interaction starts when a user presses down with a mouse or their finger on the target, and ends when they move the pointer off the target. It may start again if the pointer re-enters the target. `createPress` returns the current press state, which can be used to adjust the visual appearance of the target. If the pointer is released over the target, then an onPress event is fired.

- Handles mouse and touch events
- Handles `Enter` or `Space` key presses
- Handles screen reader virtual clicks
- Uses pointer events where available, with fallbacks to mouse and touch events
- Normalizes focus behavior on mouse and touch interactions across browsers
- Handles disabling text selection on mobile while the press interaction is active
- Handles canceling press interactions on scroll
- Normalizes many cross browser inconsistencies

Read [React Spectrum blog post](https://react-spectrum.adobe.com/blog/building-a-button-part-1.html) about the complexities of press event handling to learn more.

### API

`createPress` returns props that you should spread onto the target element, along with the current press state:

| Name         | Type                      | Description                              |
| ------------ | ------------------------- | ---------------------------------------- |
| `isPressed`  | `Accessor<boolean>`       | Whether the target is currently pressed. |
| `pressProps` | `JSX.HTMLAttributes<any>` | Props to spread on the target element.   |

`createPress` supports the following event handlers:

| Name            | Type                           | Description                                                                                                             |
| --------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `onPress`       | `(e: PressEvent) => void`      | Handler that is called when the press is released over the target.                                                      |
| `onPressStart`  | `(e: PressEvent) => void`      | Handler that is called when a press interaction starts.                                                                 |
| `onPressEnd`    | `(e: PressEvent) => void`      | Handler that is called when a press interaction ends, either over the target or when the pointer leaves the target.     |
| `onPressUp`     | `(e: PressEvent) => void`      | Handler that is called when a press is released over the target, regardless of whether it started on the target or not. |
| `onPressChange` | `(isPressed: boolean) => void` | Handler that is called when the press state changes.                                                                    |

Each of these handlers is fired with a `PressEvent`, which exposes information about the target and the type of event that triggered the interaction.

| Name          | Type                                                 | Description                                                          |
| ------------- | ---------------------------------------------------- | -------------------------------------------------------------------- |
| `type`        | `'pressstart' \| 'pressend' \| 'pressup' \| 'press'` | The type of press event being fired.                                 |
| `pointerType` | `PointerType`                                        | The pointer type that triggered the press event.                     |
| `target`      | `HTMLElement`                                        | The target element of the press event.                               |
| `shiftKey`    | `boolean`                                            | Whether the shift keyboard modifier was held during the press event. |
| `ctrlKey`     | `boolean`                                            | Whether the ctrl keyboard modifier was held during the press event.  |
| `metaKey`     | `boolean`                                            | Whether the meta keyboard modifier was held during the press event.  |
| `altKey`      | `boolean`                                            | Whether the alt keyboard modifier was held during the press event.   |

### How to use it

This example shows a simple target that handles press events with `createPress` and logs them to a list below. It also uses the `isPressed` state to adjust the background color when the target is pressed. Press down on the target and drag your pointer off and over to see when the events are fired, and try focusing the target with a keyboard and pressing the `Enter` or `Space` keys to trigger events as well.

**NOTE:** for more advanced button functionality, see [`createButton`](../button/).

```tsx
import { createPress } from "@solid-aria/interactions";
import { createSignal, For } from "solid-js";

function Example() {
  const [events, setEvents] = createSignal<string[]>([]);

  let ref: HTMLDivElement | undefined;

  const { pressProps, isPressed } = createPress(
    {
      onPressStart: e => {
        setEvents(events => [...events, `press start with ${e.pointerType}`]);
      },
      onPressEnd: e => {
        setEvents(events => [...events, `press end with ${e.pointerType}`]);
      },
      onPress: e => {
        setEvents(events => [...events, `press with ${e.pointerType}`]);
      }
    },
    () => ref
  );

  return (
    <>
      <div
        {...pressProps}
        ref={ref}
        style={{
          background: isPressed() ? "darkgreen" : "green",
          color: "white",
          display: "inline-block",
          padding: 4,
          cursor: "pointer"
        }}
        role="button"
        tabIndex={0}
      >
        Press me!
      </div>
      <ul
        style={{
          maxHeight: "200px",
          overflow: "auto"
        }}
      >
        <For each={events()}>{e => <li>{e}</li>}</For>
      </ul>
    </>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
