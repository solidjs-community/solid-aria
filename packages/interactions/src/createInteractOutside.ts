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

import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";

interface CreateInteractOutsideProps {
  /**
   * Whether the interact outside events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /**
   * Handler that is called when an interaction outside of the `ref` element start.
   */
  onInteractOutsideStart?: (e: Event) => void;

  /**
   * Handler that is called when interaction outside of the `ref` element end.
   */
  onInteractOutside?: (e: Event) => void;
}

/**
 * Handles interaction outside a given element.
 * Used in components like Dialogs and Popovers so they can close when a user clicks outside them.
 * @param props - Props for the interact outside primitive.
 * @param ref - A ref for the HTML element.
 */
export function createInteractOutside(
  props: CreateInteractOutsideProps,
  ref: Accessor<Element | undefined>
) {
  const [isPointerDown, setIsPointerDown] = createSignal(false);
  const [ignoreEmulatedMouseEvents, setIgnoreEmulatedMouseEvents] = createSignal(false);

  createEffect(() => {
    if (access(props.isDisabled)) {
      return;
    }

    // Same handler logic used for pointer, mouse and touch down/start events.
    const onPointerDown = (e: PointerEvent | MouseEvent | TouchEvent) => {
      if (isValidEvent(e, ref())) {
        props.onInteractOutsideStart?.(e);
        setIsPointerDown(true);
      }
    };

    // Use pointer events if available. Otherwise, fall back to mouse and touch events.
    if (typeof PointerEvent !== "undefined") {
      const onPointerUp = (e: PointerEvent) => {
        if (isPointerDown() && isValidEvent(e, ref())) {
          setIsPointerDown(false);
          props.onInteractOutside?.(e);
        }
      };

      // changing these to capture phase fixed combobox
      document.addEventListener("pointerdown", onPointerDown, true);
      document.addEventListener("pointerup", onPointerUp, true);

      onCleanup(() => {
        document.removeEventListener("pointerdown", onPointerDown, true);
        document.removeEventListener("pointerup", onPointerUp, true);
      });
    } else {
      const onMouseUp = (e: MouseEvent) => {
        if (ignoreEmulatedMouseEvents()) {
          setIgnoreEmulatedMouseEvents(false);
        } else if (isPointerDown() && isValidEvent(e, ref())) {
          setIsPointerDown(false);
          props.onInteractOutside?.(e);
        }
      };

      const onTouchEnd = (e: TouchEvent) => {
        setIgnoreEmulatedMouseEvents(true);

        if (isPointerDown() && isValidEvent(e, ref())) {
          setIsPointerDown(false);
          props.onInteractOutside?.(e);
        }
      };

      document.addEventListener("mousedown", onPointerDown, true);
      document.addEventListener("mouseup", onMouseUp, true);
      document.addEventListener("touchstart", onPointerDown, true);
      document.addEventListener("touchend", onTouchEnd, true);

      onCleanup(() => {
        document.removeEventListener("mousedown", onPointerDown, true);
        document.removeEventListener("mouseup", onMouseUp, true);
        document.removeEventListener("touchstart", onPointerDown, true);
        document.removeEventListener("touchend", onTouchEnd, true);
      });
    }
  });
}

/**
 * Returns whether the event is a valid interact outside event
 * (e.g. the event target is outside the `ref` element).
 */
function isValidEvent(event: any, ref: Element | undefined) {
  if (event.button > 0) {
    return false;
  }

  // if the event target is no longer in the document
  if (event.target) {
    const ownerDocument = event.target.ownerDocument;

    if (!ownerDocument || !ownerDocument.documentElement.contains(event.target)) {
      return false;
    }
  }

  return ref && !ref.contains(event.target);
}
