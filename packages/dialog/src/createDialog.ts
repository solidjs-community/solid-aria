import { focusSafely } from "@solid-aria/focus";
import { AriaLabelingProps, DOMElements, DOMProps } from "@solid-aria/types";
import { createSlotId, filterDOMProps } from "@solid-aria/utils";
import { Accessor, createEffect, createMemo, JSX, onCleanup } from "solid-js";

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

  // Focus the dialog itself on mount, unless a child element is already focused.
  createEffect(() => {
    const dialogEl = ref();

    if (dialogEl && !dialogEl.contains(document.activeElement)) {
      focusSafely(dialogEl);

      // Safari on iOS does not move the VoiceOver cursor to the dialog
      // or announce that it has opened until it has rendered. A workaround
      // is to wait for half a second, then blur and re-focus the dialog.
      const timeoutId = setTimeout(() => {
        if (document.activeElement === dialogEl) {
          dialogEl.blur();
          focusSafely(dialogEl);
        }
      }, 500);

      onCleanup(() => {
        clearTimeout(timeoutId);
      });
    }
  });

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  // We do not use aria-modal due to a Safari bug which forces the first focusable element to be focused
  // on mount when inside an iframe, no matter which element we programmatically focus.
  // See https://bugs.webkit.org/show_bug.cgi?id=211934.
  // useModal sets aria-hidden on all elements outside the dialog, so the dialog will behave as a modal
  // even without aria-modal on the dialog itself.
  const dialogProps = createMemo(() => ({
    ...domProps(),
    role: props.role ?? "dialog",
    tabIndex: -1,
    "aria-labelledby": props["aria-labelledby"] || titleId()
  }));

  const titleProps = createMemo(() => ({
    id: titleId()
  }));

  return { dialogProps, titleProps };
}
