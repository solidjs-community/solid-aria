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
- [`createKeyboard`](#createkeyboard) - Handles keyboard interactions for a focusable element.
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

### How to use it

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

This example shows a simple target that handles press events with `createPress` and logs them to a list below. It also uses the `isPressed` state to adjust the background color when the target is pressed. Press down on the target and drag your pointer off and over to see when the events are fired, and try focusing the target with a keyboard and pressing the `Enter` or `Space` keys to trigger events as well.

**NOTE:** for more advanced button functionality, see [`createButton`](../button/).

```tsx
import { createPress } from "@solid-aria/interactions";
import { createSignal, For } from "solid-js";

function Example() {
  const [events, setEvents] = createSignal<string[]>([]);

  const { pressProps, isPressed } = createPress<HTMLDivElement>({
    onPressStart: e => {
      setEvents(events => [...events, `press start with ${e.pointerType}`]);
    },
    onPressEnd: e => {
      setEvents(events => [...events, `press end with ${e.pointerType}`]);
    },
    onPress: e => {
      setEvents(events => [...events, `press with ${e.pointerType}`]);
    }
  });

  return (
    <>
      <div
        {...pressProps}
        style={{
          background: isPressed() ? "darkgreen" : "green",
          color: "white",
          display: "inline-block",
          padding: "4px",
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

## `createLongPress`

Handles long press interactions across mouse and touch devices. Supports a customizable time threshold, accessibility description, and normalizes behavior across browsers and devices.

### Features

`createLongPress` handles long press interactions across both mouse and touch devices. A long press is triggered when a user presses and holds their pointer over a target for a minimum period of time. If the user moves their pointer off of the target before the time threshold, the interaction is canceled. Once a long press event is triggered, other pointer interactions that may be active such as `createPress` will be canceled so that only the long press is activated.

- Handles mouse and touch events
- Uses pointer events where available, with fallbacks to mouse and touch events
- Ignores emulated mouse events in mobile browsers
- Prevents text selection on touch devices while long pressing
- Prevents browser and OS context menus from appearing while long pressing
- Customizable time threshold for long press
- Supports an accessibility description to indicate to assistive technology users that a long press action is available

### How to use it

`createLongPress` returns props that you should spread onto the target element:

| Name             | Type                      | Description                            |
| ---------------- | ------------------------- | -------------------------------------- |
| `longPressProps` | `JSX.HTMLAttributes<any>` | Props to spread on the target element. |

`createLongPress` supports the following event handlers and options:

| Name                       | Type                          | Default | Description                                                                                                                   |
| -------------------------- | ----------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `isDisabled`               | `boolean`                     |         | Whether long press events should be disabled.                                                                                 |
| `onLongPressStart`         | `(e: LongPressEvent) => void` |         | Handler that is called when a long press interaction starts.                                                                  |
| `onLongPressEnd`           | `(e: LongPressEvent) => void` |         | Handler that is called when a long press interaction ends, either over the target or when the pointer leaves the target.      |
| `onLongPress`              | `(e: LongPressEvent) => void` |         | Handler that is called when the threshold time is met while the press is over the target.                                     |
| `threshold`                | `number`                      | 500     | The amount of time in milliseconds to wait before triggering a long press.                                                    |
| `accessibilityDescription` | `string`                      |         | A description for assistive techology users indicating that a long press action is available, e.g. "Long press to open menu". |

Each of these handlers is fired with a `LongPressEvent`, which exposes information about the target and the type of event that triggered the interaction.

| Name          | Type                                                | Description                                                          |
| ------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| `type`        | `'longpressstart' \| 'longpressend' \| 'longpress'` | The type of long press event being fired.                            |
| `pointerType` | `PointerType`                                       | The pointer type that triggered the press event.                     |
| `target`      | `HTMLElement`                                       | The target element of the press event.                               |
| `shiftKey`    | `boolean`                                           | Whether the shift keyboard modifier was held during the press event. |
| `ctrlKey`     | `boolean`                                           | Whether the ctrl keyboard modifier was held during the press event.  |
| `metaKey`     | `boolean`                                           | Whether the meta keyboard modifier was held during the press event.  |
| `altKey`      | `boolean`                                           | Whether the alt keyboard modifier was held during the press event.   |

This example shows a button that has both a normal press action using `createPress`, as well as a long press action using `createLongPress`. Pressing the button will set the mode to "Normal speed", and long pressing it will set the mode to "Hyper speed". All of the emitted events are also logged below. Note that when long pressing the button, only a long press is emitted, and no normal press is emitted on pointer up.

**Note:** this example does not have a keyboard accessible way to trigger the long press action. Because the method of triggering this action will differ depending on the component, it is outside the scope of `createLongPress`. Make sure to implement a keyboard friendly alternative to all long press interactions if you are using this primitive directly.

```tsx
import { createLongPress, createPress } from "@solid-aria/interactions";
import { combineProps } from "@solid-primitives/props";
import { createSignal, For } from "solid-js";

function Example() {
  const [events, setEvents] = createSignal<string[]>([]);
  const [mode, setMode] = createSignal("Activate");

  const { longPressProps } = createLongPress<HTMLButtonElement>({
    accessibilityDescription: "Long press to activate hyper speed",
    onLongPressStart: e =>
      setEvents(events => [...events, `long press start with ${e.pointerType}`]),
    onLongPressEnd: e => setEvents(events => [...events, `long press end with ${e.pointerType}`]),
    onLongPress: e => {
      setMode("Hyper speed");
      setEvents(events => [...events, `long press with ${e.pointerType}`]);
    }
  });

  const { pressProps } = createPress<HTMLButtonElement>({
    onPress: e => {
      setMode("Normal speed");
      setEvents(events => [...events, `press with ${e.pointerType}`]);
    }
  });

  return (
    <>
      <button {...combineProps(pressProps, longPressProps)}>{mode}</button>
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

## `createHover`

Handles pointer hover interactions for an element. Normalizes behavior across browsers and platforms, and ignores emulated mouse events on touch devices.

### Features

`createHover` handles hover interactions for an element. A hover interaction begins when a user moves their pointer over an element, and ends when they move their pointer off of the element.

- Uses pointer events where available, with fallbacks to mouse and touch events
- Ignores emulated mouse events in mobile browsers

`createHover` is similar to the `:hover` pseudo class in CSS, but `:hover` is problematic on touch devices due to mouse emulation in mobile browsers. Depending on the browser and device, `:hover` may never apply, or may apply continuously until the user touches another element. `createHover` only applies when the pointer is truly capable of hovering, and emulated mouse events are ignored.

Read [React Spectrum blog post](https://react-spectrum.adobe.com/blog/building-a-button-part-2.html) about the complexities of hover event handling to learn more.

### Accessibility

Hover interactions should never be the only way to interact with an element because they are not supported across all devices. Alternative interactions should be provided on touch devices, for example a long press or an explicit button to tap.

In addition, even on devices with hover support, users may be using a keyboard or screen reader to navigate your app, which also do not trigger hover events. Hover interactions should be paired with focus events in order to expose the content to keyboard users.

### How to use it

`createHover` returns props that you should spread onto the target element, along with the current hover state:

| Name         | Type                      | Description                            |
| ------------ | ------------------------- | -------------------------------------- |
| `isHovered`  | `Accessor<boolean>`       | Whether the target element is hovered. |
| `hoverProps` | `JSX.HTMLAttributes<any>` | Props to spread on the target element. |

`createHover` supports the following event handlers:

| Name            | Type                            | Description                                             |
| --------------- | ------------------------------- | ------------------------------------------------------- |
| `onHoverStart`  | `(e: HoverEvent) => void`       | Handler that is called when a hover interaction starts. |
| `onHoverEnd`    | `(e: HoverEvent) => void`       | Handler that is called when a hover interaction ends.   |
| `onHoverChange` | `(isHovering: boolean) => void` | Handler that is called when the hover state changes.    |

Each of these handlers is fired with a `HoverEvent`, which exposes information about the target and the type of event that triggered the interaction.

| Name          | Type                         | Description                                      |
| ------------- | ---------------------------- | ------------------------------------------------ |
| `type`        | `'hoverstart' \| 'hoverend'` | The type of hover event being fired.             |
| `pointerType` | `'mouse' \| 'pen'`           | The pointer type that triggered the hover event. |
| `target`      | `HTMLElement`                | The target element of the hover event.           |

This example shows a simple target that handles hover events with useHover and logs them to a list below. It also uses the `isHovered` state to adjust the background color when the target is hovered.

```tsx
import { createHover } from "@solid-aria/interactions";
import { createSignal, For } from "solid-js";

function Example() {
  const [events, setEvents] = createSignal<string[]>([]);

  const { hoverProps, isHovered } = createHover({
    onHoverStart: e => {
      setEvents(events => [...events, `hover start with ${e.pointerType}`]);
    },
    onHoverEnd: e => {
      setEvents(events => [...events, `hover end with ${e.pointerType}`]);
    }
  });

  return (
    <>
      <div
        {...hoverProps}
        style={{
          background: isHovered() ? "darkgreen" : "green",
          color: "white",
          display: "inline-block",
          padding: "4px",
          cursor: "pointer"
        }}
        role="button"
        tabIndex={0}
      >
        Hover me!
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

## `createFocus`

Handles focus events for the immediate target. Focus events on child elements will be ignored.

### Features

`createFocus` handles focus interactions for an element. This is similar to the `:focus` pseudo class in CSS.

To handle focus events on descendants of an element, see [`createFocusWithin`](#createfocuswithin).

### How to use it

`createFocus` returns props that you should spread onto the target element:

| Name         | Type                      | Description                              |
| ------------ | ------------------------- | ---------------------------------------- |
| `focusProps` | `JSX.HTMLAttributes<any>` | Props to spread onto the target element. |

`createFocus` supports the following event handlers:

| Name            | Type                           | Description                                                     |
| --------------- | ------------------------------ | --------------------------------------------------------------- |
| `onFocus`       | `(e: FocusEvent) => void`      | Handler that is called when the element receives focus.         |
| `onBlur`        | `(e: FocusEvent) => void`      | Handler that is called when the element loses focus.            |
| `onFocusChange` | `(isFocused: boolean) => void` | Handler that is called when the element's focus status changes. |

This example shows a simple input element that handles focus events with `createFocus` and logs them to a list below.

```tsx
import { createFocus } from "@solid-aria/interactions";
import { createSignal, For } from "solid-js";

function Example() {
  const [events, setEvents] = createSignal<string[]>([]);

  const { focusProps } = createFocus({
    onFocus: e => {
      setEvents(events => [...events, "focus"]);
    },
    onBlur: e => {
      setEvents(events => [...events, "blur"]);
    },
    onFocusChange: isFocused => {
      setEvents(events => [...events, `focus change: ${isFocused}`]);
    }
  });

  return (
    <>
      <label for="example">Example</label>
      <input {...focusProps} id="example" />
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

## `createFocusWithin`

Handles focus events for the target and its descendants.

### Features

`createFocusWithin` handles focus interactions for an element and its descendants. Focus is "within" an element when either the element itself or a descendant element has focus. This is similar to the `:focus-within` pseudo class in CSS.

To handle focus events on only the target element, and not descendants, see [`createFocus`](#createfocus).

### How to use it

`createFocusWithin` returns props that you should spread onto the target element:

| Name               | Type                      | Description                              |
| ------------------ | ------------------------- | ---------------------------------------- |
| `focusWithinProps` | `JSX.HTMLAttributes<any>` | Props to spread onto the target element. |

`createFocusWithin` supports the following event handlers:

| Name                  | Type                               | Description                                                                    |
| --------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| `onFocusIn`           | `(e: FocusEvent) => void`          | Handler that is called when the target element or a descendant receives focus. |
| `onFocusOut`          | `(e: FocusEvent) => void`          | Handler that is called when the target element and all descendants lose focus. |
| `onFocusWithinChange` | `(isFocusWithin: boolean) => void` | Handler that is called when the the focus within state changes.                |

This example shows two text fields inside a div, which handles focus within events. It stores focus within state in local component state, which is updated by an onFocusWithinChange handler. This is used to update the background color and text color of the group while one of the text fields has focus.

Focus within and blur within events are also logged to the list below. Notice that the events are only fired when the wrapper gains and loses focus, not when focus moves within the group.

```tsx
import { createFocusWithin } from "@solid-aria/interactions";
import { createSignal, For } from "solid-js";

function Example() {
  const [events, setEvents] = createSignal<string[]>([]);
  const [isFocusWithin, setFocusWithin] = createSignal(false);

  let { focusWithinProps } = createFocusWithin({
    onFocusIn: e => {
      setEvents(events => [...events, "focus in"]);
    },
    onFocusOut: e => {
      setEvents(events => [...events, "focus out"]);
    },
    onFocusWithinChange: isFocusWithin => {
      setFocusWithin(isFocusWithin);
    }
  });

  return (
    <>
      <div
        {...focusWithinProps}
        style={{
          display: "inline-block",
          border: "1px solid gray",
          padding: "10px",
          background: isFocusWithin() ? "goldenrod" : "",
          color: isFocusWithin() ? "black" : ""
        }}
      >
        <label style={{ display: "block" }}>
          First Name: <input />
        </label>
        <label style={{ display: "block" }}>
          Last Name: <input />
        </label>
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

## `createFocusVisible`

Manages focus visible state for the page, and subscribes individual components for updates.

### Features

`createFocusVisible` handles focus interactions for the page and determines whether keyboard focus should be visible (e.g. with a focus ring). Focus visibility is computed based on the current interaction mode of the user. When the user interacts via a mouse or touch, then focus is not visible. When the user interacts via a keyboard or screen reader, then focus is visible. This is similar to the `:focus-visible` pseudo class in CSS.

To determine whether a focus ring should be visible for an individual component rather than globally, see [`createFocusRing`](../focus/).

### How to use it

This example shows focus visible state and updates as you interact with the page. By default, when the page loads, it is true. If you press anywhere on the page with a mouse or touch, then focus visible state is set to false. If you keyboard navigate around the page then it is set to true again.

Note that this example uses the `isTextInput` option so that only certain navigation keys cause focus visible state to appear. This prevents focus visible state from appearing when typing text in a text field.

```tsx
import { createFocusVisible } from "@solid-aria/interactions";

function Example() {
  const { isFocusVisible } = createFocusVisible({ isTextInput: true });

  return (
    <>
      <div>Focus visible: {String(isFocusVisible())}</div>
      <label style={{ display: "block" }}>
        First Name: <input />
      </label>
      <label style={{ display: "block" }}>
        Last Name: <input />
      </label>
    </>
  );
}
```

## `createKeyboard`

Handles keyboard interactions for a focusable element.

### How to use it

`createKeyboard` returns props that you should spread onto the target element:

| Name            | Type                      | Description                              |
| --------------- | ------------------------- | ---------------------------------------- |
| `keyboardProps` | `JSX.HTMLAttributes<any>` | Props to spread onto the target element. |

`createKeyboard` supports the following event handlers:

| Name        | Type                         | Description                                    |
| ----------- | ---------------------------- | ---------------------------------------------- |
| `onKeyDown` | `(e: KeyboardEvent) => void` | Handler that is called when a key is pressed.  |
| `onKeyUp`   | `(e: KeyboardEvent) => void` | Handler that is called when a key is released. |

This example shows a simple input element that handles keyboard events with `createKeyboard` and logs them to a list below.

```tsx
import { createKeyboard } from "@solid-aria/interactions";
import { createSignal, For } from "solid-js";

function Example() {
  const [events, setEvents] = createSignal<string[]>([]);

  const { keyboardProps } = createKeyboard({
    onKeyDown: e => {
      setEvents(events => [...events, `key down: ${e.key}`]);
    },
    onKeyUp: e => {
      setEvents(events => [...events, `key up: ${e.key}`]);
    }
  });

  return (
    <>
      <label for="example">Example</label>
      <input {...keyboardProps} id="example" />
      <ul
        style={{
          height: "100px",
          overflow: "auto",
          border: "1px solid gray",
          width: "200px"
        }}
      >
        <For each={events()}>{e => <li>{e}</li>}</For>
      </ul>
    </>
  );
}
```

## `createInteractOutside`

Handles interaction outside a given element. Used in components like Dialogs and Popovers so they can close when a user clicks outside them.

### How to use it

`createInteractOutside` supports the following event handlers:

| Name                     | Type                 | Description                                                                    |
| ------------------------ | -------------------- | ------------------------------------------------------------------------------ |
| `onInteractOutsideStart` | `(e: Event) => void` | Handler that is called when an interaction outside of the `ref` element start. |
| `onInteractOutside`      | `(e: Event) => void` | Handler that is called when interaction outside of the `ref` element end.      |

This example shows a simple target that handles outside interaction with `createInteractOutside` and logs them to a list below.

```tsx
import { createInteractOutside } from "@solid-aria/interactions";
import { createSignal, For } from "solid-js";

function Example() {
  let ref: HTMLDivElement | undefined;

  const [events, setEvents] = createSignal<string[]>([]);
  const [isInteractOutside, setInteractOutside] = createSignal(false);

  createInteractOutside(
    {
      onInteractOutsideStart: e => {
        setEvents(events => [...events, "interact outside start"]);
        setInteractOutside(true);
      },
      onInteractOutside: e => {
        setEvents(events => [...events, "interact outside"]);
        setInteractOutside(false);
      }
    },
    () => ref
  );

  return (
    <>
      <div
        ref={ref}
        style={{
          display: "inline-block",
          border: "1px solid gray",
          padding: "10px",
          background: isInteractOutside() ? "red" : "",
          color: isInteractOutside() ? "white" : ""
        }}
      >
        Interact outside me!
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
