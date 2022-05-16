import { focusSafely } from "@solid-aria/focus";
import { AriaLabelingProps, DOMElements, DOMProps } from "@solid-aria/types";
import { createSlotId, filterDOMProps } from "@solid-aria/utils";
import { Accessor, createMemo, JSX, onCleanup, onMount } from "solid-js";

export interface AriaDialogProps extends DOMProps, AriaLabelingProps {
  /**
   * The accessibility role for the dialog.
   * @default 'dialog'
   */
  role?: "dialog" | "alertdialog";
}

export interface DialogAria<
  DialogElementType extends DOMElements,
  TitleElementType extends DOMElements
> {
  /**
   * Props for the dialog container element.
   */
  dialogProps: Accessor<JSX.IntrinsicElements[DialogElementType]>;

  /**
   * Props for the dialog title element.
   */
  titleProps: Accessor<JSX.IntrinsicElements[TitleElementType]>;
}

/**
 * Provides the behavior and accessibility implementation for a dialog component.
 * A dialog is an overlay shown above other content in an application.
 */
export function createDialog<
  DialogElementType extends DOMElements = "div",
  TitleElementType extends DOMElements = "h3",
  RefElement extends HTMLElement = HTMLDivElement
>(
  props: AriaDialogProps,
  ref: Accessor<RefElement | undefined>
): DialogAria<DialogElementType, TitleElementType> {
  const defaultTitleId = createSlotId();

  const titleId = createMemo(() => {
    return props["aria-label"] ? undefined : defaultTitleId();
  });

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  // Note: aria-modal has a bug in Safari which forces the first focusable element to be focused
  // on mount when inside an iframe, no matter which element we programmatically focus.
  // See https://bugs.webkit.org/show_bug.cgi?id=211934.
  //
  // `createModal` sets aria-hidden on all elements outside the dialog, so the dialog will behave as a modal
  // even without aria-modal on the dialog itself.
  const dialogProps = createMemo(() => ({
    ...domProps(),
    role: props.role ?? "dialog",
    tabIndex: -1,
    "aria-modal": true,
    "aria-labelledby": props["aria-labelledby"] || titleId()
  }));

  const titleProps = createMemo(() => ({
    id: titleId()
  }));

  onMount(() => {
    let iosSafariFocusTimeoutId: number;

    // Use `requestAnimationFrame` to ensure DOM elements has been rendered
    // and things like browser `autofocus` has run first.
    requestAnimationFrame(() => {
      const dialogEl = ref();

      if (dialogEl && !dialogEl.contains(document.activeElement)) {
        focusSafely(dialogEl);

        // Safari on iOS does not move the VoiceOver cursor to the dialog
        // or announce that it has opened until it has rendered. A workaround
        // is to wait for half a second, then blur and re-focus the dialog.
        iosSafariFocusTimeoutId = window.setTimeout(() => {
          if (document.activeElement === dialogEl) {
            dialogEl.blur();
            focusSafely(dialogEl);
          }
        }, 500);
      }
    });

    onCleanup(() => clearTimeout(iosSafariFocusTimeoutId));
  });

  return { dialogProps, titleProps };
}
