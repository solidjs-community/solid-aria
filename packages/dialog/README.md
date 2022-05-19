<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Dialog" alt="Solid Aria - Dialog">
</p>

# @solid-aria/dialog

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/dialog?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/dialog)
[![version](https://img.shields.io/npm/v/@solid-aria/dialog?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/dialog)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Dialog is an overlay shown above other content in an application.

- [`createDialog`](#createdialog) - Provides the behavior and accessibility implementation for a dialog component.

## Installation

```bash
npm install @solid-aria/dialog
# or
yarn add @solid-aria/dialog
# or
pnpm add @solid-aria/dialog
```

## `createDialog`

Provides the behavior and accessibility implementation for a dialog component.

### Features

The HTML `<dialog>` element can be used to build dialogs. However, it is not yet widely supported across browsers, and building fully accessible custom dialogs from scratch is very difficult and error prone. `createDialog`, combined with `createModal`, helps achieve accessible dialogs that can be styled as needed.

- Exposed to assistive technology as a dialog or alertdialog with ARIA
- Handles labelling the dialog by its title element
- Handles focusing the dialog on mount, unless a child element is already focused
- Contains focus inside the dialog when combined with `<FocusScope>`
- Hides content behind the dialog from screen readers when combined with `createModal`
- Prevents scrolling the page behind the dialog when combined with `createPreventScroll`
- Handles closing the dialog when interacting outside and pressing the `Escape` key, when combined with `createOverlay`

### How to use it

This example shows how to build a typical modal dialog. It has a partially transparent backdrop above the rest of the page, prevents scrolling the body using `createPreventScroll`, and hides content outside the dialog with `createModal`.

The modal can be closed by clicking or interacting outside the dialog if the `isDismissable` prop is set to true, or by pressing the `Escape` key. This is handled by `createOverlay`.

Focus is contained within the dialog while it is open using a `<FocusScope>`. In addition, the first focusable element is automatically focused when the dialog opens, and focus is restored back to the button that opened it when it closes.

The application is contained in an `OverlayProvider`, which is used to hide the content from screen readers with `aria-hidden` while a modal is open. In addition, each modal must be contained in an `OverlayContainer`, which uses a SolidJS Portal to render the modal at the end of the document body. If a nested modal is opened, then the first modal will also be set to `aria-hidden`, so that only the top-most modal is accessible.

```tsx
import { createButton } from "@solid-aria/button";
import { AriaDialogProps, createDialog } from "@solid-aria/dialog";
import { FocusScope } from "@solid-aria/focus";
import {
  AriaModalProps,
  AriaOverlayProps,
  createModal,
  createOverlay,
  createOverlayTriggerState,
  createPreventScroll,
  OverlayContainer,
  OverlayProvider
} from "@solid-aria/overlays";

import { JSX, Show } from "solid-js";

interface ModalDialogProps extends AriaDialogProps, AriaModalProps, AriaOverlayProps {
  title?: JSX.Element;
  children?: JSX.Element;
}

function ModalDialog(props: ModalDialogProps) {
  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  let ref: HTMLDivElement | undefined;
  const { overlayProps, underlayProps } = createOverlay(props, () => ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  createPreventScroll();
  const { modalProps } = createModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = createDialog(props, () => ref);

  return (
    <div
      style={{
        position: "fixed",
        "z-index": 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        "align-items": "center",
        "justify-content": "center"
      }}
      {...underlayProps()}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps()}
          {...dialogProps()}
          {...modalProps()}
          ref={ref}
          style={{
            background: "white",
            color: "black",
            padding: "30px"
          }}
        >
          <h3 {...titleProps()} style={{ "margin-top": 0 }}>
            {props.title}
          </h3>
          {props.children}
        </div>
      </FocusScope>
    </div>
  );
}

function Example() {
  let openButtonRef: HTMLButtonElement | undefined;
  let closeButtonRef: HTMLButtonElement | undefined;

  const state = createOverlayTriggerState({});

  // createButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // dialog closes.
  const { buttonProps: openButtonProps } = createButton(
    {
      onPress: () => state.open()
    },
    () => openButtonRef
  );

  const { buttonProps: closeButtonProps } = createButton(
    {
      onPress: () => state.close()
    },
    () => closeButtonRef
  );

  return (
    <>
      <button {...openButtonProps()} ref={openButtonRef}>
        Open Dialog
      </button>
      <Show when={state.isOpen()}>
        <OverlayContainer>
          <ModalDialog title="Enter your name" isOpen onClose={state.close} isDismissable>
            <form style={{ display: "flex", "flex-direction": "column" }}>
              <label for="first-name">First Name:</label>
              <input id="first-name" />
              <label for="last-name">Last Name:</label>
              <input id="last-name" />
              <button {...closeButtonProps()} ref={closeButtonRef} style={{ "margin-top": "10px" }}>
                Submit
              </button>
            </form>
          </ModalDialog>
        </OverlayContainer>
      </Show>
    </>
  );
}

function App() {
  return (
    // Application must be wrapped in an OverlayProvider so that it can be
    // hidden from screen readers when a modal opens.
    <OverlayProvider>
      <Example />
    </OverlayProvider>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
