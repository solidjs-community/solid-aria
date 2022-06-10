/*
 * Copyright 2022 Solid Aria Working Group.
 * MIT License
 *
 * Portions of this file are based on code from react-spectrum.
 * Copyright 2020 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { focusSafely } from "@solid-aria/focus";
import { AriaLabelingProps, DOMProps } from "@solid-aria/types";
import { createSlotId, filterDOMProps } from "@solid-aria/utils";
import { Accessor, JSX, mergeProps, onCleanup, onMount } from "solid-js";

export interface AriaDialogProps extends DOMProps, AriaLabelingProps {
  /**
   * The accessibility role for the dialog.
   * @default 'dialog'
   */
  role?: "dialog" | "alertdialog";
}

export interface DialogAria {
  /**
   * Props for the dialog container element.
   */
  dialogProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the dialog title element.
   */
  titleProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for a dialog component.
 * A dialog is an overlay shown above other content in an application.
 */
export function createDialog<T extends HTMLElement>(
  props: AriaDialogProps,
  ref: Accessor<T | undefined>
): DialogAria {
  const defaultTitleId = createSlotId();

  const titleId = () => {
    return props["aria-label"] ? undefined : defaultTitleId();
  };

  const domProps = filterDOMProps(props, { labelable: true });

  // Note: aria-modal has a bug in Safari which forces the first focusable element to be focused
  // on mount when inside an iframe, no matter which element we programmatically focus.
  // See https://bugs.webkit.org/show_bug.cgi?id=211934.
  //
  // `createModal` sets aria-hidden on all elements outside the dialog, so the dialog will behave as a modal
  // even without aria-modal on the dialog itself.
  const dialogProps = mergeProps(domProps, {
    tabIndex: -1,
    "aria-modal": true,
    get role() {
      return props.role ?? "dialog";
    },
    get "aria-labelledby"() {
      return props["aria-labelledby"] || titleId();
    }
  });

  const titleProps = {
    get id() {
      return titleId();
    }
  };

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
