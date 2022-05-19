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

import { createSignal, onCleanup } from "solid-js";

// Keyboards, Assistive Technologies, and element.click() all produce a "virtual"
// click event. This is a method of inferring such clicks. Every browser except
// IE 11 only sets a zero value of "detail" for click events that are "virtual".
// However, IE 11 uses a zero value for all click events. For IE 11 we rely on
// the quirk that it produces click events that are of type PointerEvent, and
// where only the "virtual" click lacks a pointerType field.
export function isVirtualClick(event: MouseEvent | PointerEvent): boolean {
  // JAWS/NVDA with Firefox.
  if ((event as any).mozInputSource === 0 && event.isTrusted) {
    return true;
  }

  return event.detail === 0 && !(event as PointerEvent).pointerType;
}

export function createSyntheticBlurEvent(onBlur: (event: FocusEvent) => void) {
  const [isFocused, setIsFocused] = createSignal(false);
  const [observer, setObserver] = createSignal<MutationObserver | null>(null);

  // This function is called during a SolidJS onFocus event.
  const onFocus = (e: FocusEvent) => {
    // Most browsers fire a native focusout event when an element is disabled, except for Firefox.
    // In that case, we use a MutationObserver to watch for the disabled attribute, and dispatch these events ourselves.
    // For browsers that do, focusout fires before the MutationObserver, so onBlur should not fire twice.
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      setIsFocused(true);

      const target = e.target;

      const onBlurHandler = (e: FocusEvent) => {
        setIsFocused(false);

        if (target.disabled) {
          // For backward compatibility, dispatch a (fake) event.
          onBlur(new FocusEvent("blur", e));
        }

        // We no longer need the MutationObserver once the target is blurred.
        observer()?.disconnect();
        setObserver(null);
      };

      target.addEventListener("focusout", onBlurHandler as EventListener, { once: true });

      const mutationCallback = () => {
        if (isFocused() && target.disabled) {
          observer()?.disconnect();
          target.dispatchEvent(new FocusEvent("blur"));
          target.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
        }
      };

      setObserver(new MutationObserver(mutationCallback));

      observer()?.observe(target, { attributes: true, attributeFilter: ["disabled"] });
    }
  };

  // Clean up MutationObserver on unmount.
  onCleanup(() => {
    observer()?.disconnect();
    setObserver(null);
  });

  return onFocus;
}
