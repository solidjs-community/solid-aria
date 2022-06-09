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

import { createFocusWithin, createInteractOutside } from "@solid-aria/interactions";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createEffect, createMemo, JSX, onCleanup } from "solid-js";

export interface AriaOverlayProps {
  /**
   * Whether the overlay is currently open.
   */
  isOpen?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether to close the overlay when the user interacts outside it.
   * @default false
   */
  isDismissable?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the overlay should close when focus is lost or moves outside it.
   */
  shouldCloseOnBlur?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether pressing the escape key to close the overlay should be disabled.
   * @default false
   */
  isKeyboardDismissDisabled?: MaybeAccessor<boolean | undefined>;

  /**
   * Handler that is called when the overlay should close.
   */
  onClose?: () => void;

  /**
   * When user interacts with the argument element outside of the overlay ref,
   * return true if onClose should be called. This gives you a chance to filter
   * out interaction with elements that should not dismiss the overlay.
   * By default, onClose will always be called on interaction outside the overlay ref.
   */
  shouldCloseOnInteractOutside?: (element: HTMLElement) => boolean;
}

export interface OverlayAria {
  /**
   * Props to apply to the overlay container element.
   */
  overlayProps: Accessor<JSX.HTMLAttributes<any>>;

  /**
   * Props to apply to the underlay element, if any.
   */
  underlayProps: Accessor<JSX.HTMLAttributes<any>>;
}

const visibleOverlays: Array<Accessor<HTMLElement | undefined>> = [];

/**
 * Provides the behavior for overlays such as dialogs, popovers, and menus.
 * Hides the overlay when the user interacts outside it, when the Escape key is pressed,
 * or optionally, on blur. Only the top-most overlay will close at once.
 */
export function createOverlay<T extends HTMLElement>(
  props: AriaOverlayProps,
  ref: Accessor<T | undefined>
): OverlayAria {
  // Add the overlay ref to the stack of visible overlays on mount, and remove on unmount.
  createEffect(() => {
    if (access(props.isOpen)) {
      visibleOverlays.push(ref);
    }

    onCleanup(() => {
      const index = visibleOverlays.indexOf(ref);

      if (index >= 0) {
        visibleOverlays.splice(index, 1);
      }
    });
  });

  // Only hide the overlay when it is the topmost visible overlay in the stack.
  const onHide = () => {
    if (visibleOverlays[visibleOverlays.length - 1]() === ref()) {
      props.onClose?.();
    }
  };

  const onInteractOutsideStart = (e: Event) => {
    if (
      !props.shouldCloseOnInteractOutside ||
      props.shouldCloseOnInteractOutside(e.target as HTMLElement)
    ) {
      if (visibleOverlays[visibleOverlays.length - 1]() === ref()) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  };

  const onInteractOutside = (e: Event) => {
    if (!access(props.isDismissable)) {
      return;
    }

    if (
      !props.shouldCloseOnInteractOutside ||
      props.shouldCloseOnInteractOutside(e.target as HTMLElement)
    ) {
      if (visibleOverlays[visibleOverlays.length - 1]() === ref()) {
        e.stopPropagation();
        e.preventDefault();
      }
      onHide();
    }
  };

  // Handle the escape key
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && !access(props.isKeyboardDismissDisabled)) {
      e.stopPropagation();
      e.preventDefault();
      onHide();
    }
  };

  // Handle clicking outside the overlay to close it
  createInteractOutside(
    {
      onInteractOutside,
      onInteractOutsideStart
    },
    ref
  );

  const { focusWithinProps } = createFocusWithin({
    isDisabled: () => !access(props.shouldCloseOnBlur),
    onFocusOut: e => {
      if (
        !props.shouldCloseOnInteractOutside ||
        props.shouldCloseOnInteractOutside(e.relatedTarget as HTMLElement)
      ) {
        props.onClose?.();
      }
    }
  });

  const onPointerDownUnderlay = (e: Event) => {
    // fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  const overlayProps = createMemo(() => {
    return {
      onKeyDown,
      ...focusWithinProps
    } as JSX.HTMLAttributes<any>;
  });

  const underlayProps = createMemo(() => {
    return {
      onPointerDown: onPointerDownUnderlay
    } as JSX.HTMLAttributes<any>;
  });

  return { overlayProps, underlayProps };
}
