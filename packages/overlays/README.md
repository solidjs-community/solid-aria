<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Overlays" alt="Solid Aria - Overlays">
</p>

# @solid-aria/overlays

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/overlays?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/overlays)
[![version](https://img.shields.io/npm/v/@solid-aria/overlays?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/overlays)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Primitives for building accessible overlay components such as dialogs, popovers, and menus.

- [`DismissButton`](#dismissbutton) - A visually hidden button that can be used to allow screen reader users to dismiss a modal or popup when there is no visual affordance to do so.
- [`createModal`](#createmodal) - Hides content outside the current `<OverlayContainer>` from screen readers on mount and restores it on unmount.
- [`createOverlay`](#createoverlay) - Provides the behavior for overlays such as dialogs, popovers, and menus.
- [`createOverlayTrigger`](#createoverlaytrigger) - Handles the behavior and accessibility for an overlay trigger.
- [`createPreventScroll`](#createpreventscroll) - Prevents scrolling on the document body on mount, and restores it on unmount.

## Installation

```bash
npm install @solid-aria/overlays
# or
yarn add @solid-aria/overlays
# or
pnpm add @solid-aria/overlays
```

## `DismissButton`

`DismissButton` is a visually hidden button that can be used by screen reader users to close an overlay in the absence of a visual dismiss button. This may typically be used with a menu or a popover since they often forgo a visual dismiss button, instead allowing users to use the `Escape` key to dismiss the menu or popover.

### How to use it

See `createOverlayTrigger` for an example of how to use `DismissButton`.

## `createModal`

Hides content outside the current `<OverlayContainer>` from screen readers on mount and restores it on unmount. Typically used by modal dialogs and other types of overlays to ensure that only the top-most modal is accessible at once.

### How to use it

See [`createDialog`](../dialog/) and `createOverlayTrigger` for examples of using `createModal` to hide external elements from screen readers.

## `createOverlay`

Provides the behavior for overlays such as dialogs, popovers, and menus. Hides the overlay when the user interacts outside it, when the Escape key is pressed, or optionally, on blur. Only the top-most overlay will close at once.

### How to use it

See [`createDialog`](../dialog/) and `createOverlayTrigger` for examples of using `createOverlay` to provide common overlay behavior to a component.

## `createOverlayTrigger`

Handles the behavior and accessibility for an overlay trigger, e.g. a button that opens a popover, menu, or other overlay that is positioned relative to the trigger.

### Features

There is no built in way to create popovers or other types of overlays in HTML. `createOverlayTrigger` helps achieve accessible overlays that can be styled as needed.

- Exposes overlay trigger and connects trigger to overlay with ARIA
- Hides content behind the overlay from screen readers when combined with `createModal`
- Handles closing the overlay when interacting outside and pressing the `Escape` key, when combined with `createOverlay`

**Note:** `createOverlayTrigger` only handles the overlay itself. It should be combined with `createDialog` to create fully accessible popovers. You will also need a positioning engine like [`@floating-ui/dom`](https://floating-ui.com/) to positions the overlay relative to the trigger.

### How to use it

This example shows how to build a typical popover overlay that is positioned relative to a trigger button. The content of the popover is a dialog, built with `createDialog`.

The popover can be closed by clicking or interacting outside the popover, or by pressing the Escape key. This is handled by `createOverlay`. When the popover is closed, focus is restored back to its trigger button by a `<FocusScope>`.

Content outside the popover is hidden from screen readers by `createModal`. This improves the experience for screen reader users by ensuring that they don't navigate out of context. This is especially important when the popover is rendered into a portal at the end of the document, and the content just before it is unrelated to the original trigger.

To allow screen reader users to more easily dismiss the popover, a visually hidden `<DismissButton>` is added at the end of the dialog.

The application is contained in an `OverlayProvider`, which is used to hide the content from screen readers with `aria-hidden` while an overlay is open. In addition, each overlay must be contained in an `OverlayContainer`, which uses a SolidJS Portal to render the overlay at the end of the document body. If a nested overlay is opened, then the first overlay will also be set to `aria-hidden`, so that only the top-most overlay is accessible to screen readers.

```tsx
import { createButton } from "@solid-aria/button";
import { createDialog } from "@solid-aria/dialog";
import { FocusScope } from "@solid-aria/focus";
import {
  AriaOverlayProps,
  createModal,
  createOverlay,
  createOverlayTrigger,
  DismissButton,
  FocusScope,
  OverlayContainer,
  OverlayProvider
} from "@solid-aria/overlays";
import { combineProps } from "@solid-primitives/props";
import { mergeRefs } from "@solid-primitives/refs";
import { access } from "@solid-primitives/utils";
import { createMemo, JSX, Ref, splitProps, Show } from "solid-js";

interface PopoverProps extends AriaOverlayProps {
  ref: Ref<HTMLDivElement | undefined>;
  title?: JSX.Element;
  children?: JSX.Element;
}

function Popover(props: PopoverProps) {
  let ref: HTMLDivElement | undefined;

  const [local, others] = splitProps(props, ["ref", "title", "children", "isOpen", "onClose"]);

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const { overlayProps } = createOverlay(
    {
      onClose: local.onClose,
      isOpen: () => access(local.isOpen),
      isDismissable: true
    },
    () => ref
  );

  // Hide content outside the modal from screen readers.
  const { modalProps } = createModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = createDialog({}, () => ref);

  const rootProps = createMemo(() => {
    return combineProps(overlayProps(), dialogProps(), modalProps(), others);
  });

  return (
    <FocusScope restoreFocus>
      <div
        {...rootProps()}
        ref={mergeRefs(el => (ref = el), local.ref)}
        style={{
          position: "absolute",
          background: "white",
          color: "black",
          padding: "30px",
          "max-width": "300px"
        }}
      >
        <h3 {...titleProps} style={{ "margin-top": 0 }}>
          {props.title}
        </h3>
        {props.children}
        <DismissButton onDismiss={local.onClose} />
      </div>
    </FocusScope>
  );
}

function Example() {
  let triggerRef: HTMLButtonElement | undefined;
  let overlayRef: HTMLDivElement | undefined;

  // Get props for the trigger and overlay.
  const { triggerProps, overlayProps, state } = createOverlayTrigger({ type: "dialog" });

  // createButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // popover closes.
  const { buttonProps } = createButton(
    {
      onPress: () => state.open()
    },
    () => triggerRef
  );

  return (
    <>
      <button {...buttonProps()} {...triggerProps()} ref={triggerRef}>
        Open Popover
      </button>
      <Show when={state.isOpen()}>
        <OverlayContainer>
          <Popover
            {...overlayProps()}
            ref={overlayRef}
            title="Popover title"
            isOpen={state.isOpen()}
            onClose={state.close}
          >
            This is the content of the popover.
          </Popover>
        </OverlayContainer>
      </Show>
    </>
  );
}

function App() {
  return (
    // Application must be wrapped in an OverlayProvider so that it can be
    // hidden from screen readers when an overlay opens.
    <OverlayProvider>
      <Example />
    </OverlayProvider>
  );
}
```

## `createPreventScroll`

Prevents scrolling on the document body on mount, and restores it on unmount. Also ensures that content does not shift due to the scrollbars disappearing.

### How to use it

```tsx
import { createPreventScroll } from "@solid-aria/overlays";
import { createSignal } from "solid-js";

function App() {
  const [isDisabled, setDisabled] = createSignal(false);

  createPreventScroll({ isDisabled });

  return (
    <>
      <button onClick={() => setDisabled(prev => !prev)}>Toggle scroll lock</button>
      <p>Very long scrollable content...</p>
    </>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
