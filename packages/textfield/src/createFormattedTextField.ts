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

import { combineProps } from "@solid-primitives/props";
import { Accessor, createEffect, JSX, on, onCleanup } from "solid-js";

import { AriaTextFieldProps, createTextField, TextFieldAria } from "./createTextField";

interface FormattedTextFieldState {
  validate: (val: string) => boolean;
  setInputValue: (val: string) => void;
}

function supportsNativeBeforeInputEvent() {
  return (
    typeof window !== "undefined" &&
    window.InputEvent &&
    typeof InputEvent.prototype.getTargetRanges === "function"
  );
}

export function createFormattedTextField(
  props: AriaTextFieldProps<"input">,
  inputRef: Accessor<HTMLInputElement | undefined>,
  state: Accessor<FormattedTextFieldState>
): TextFieldAria {
  createEffect(
    on([inputRef, state], ([input, state]) => {
      if (!supportsNativeBeforeInputEvent() || !input) {
        return;
      }

      const onBeforeInput = (e: InputEvent) => {
        const selectionStart = input.selectionStart ?? undefined;
        const selectionEnd = input.selectionEnd ?? undefined;

        // Compute the next value of the input if the event is allowed to proceed.
        // See https://www.w3.org/TR/input-events-2/#interface-InputEvent-Attributes for a full list of input types.
        let nextValue: string | undefined;

        switch (e.inputType) {
          case "historyUndo":
          case "historyRedo":
            // Explicitly allow undo/redo. e.data is null in this case, but there's no need to validate,
            // because presumably the input would have already been validated previously.
            return;
          case "deleteContent":
          case "deleteByCut":
          case "deleteByDrag":
            nextValue = input.value.slice(0, selectionStart) + input.value.slice(selectionEnd);
            break;
          case "deleteContentForward":
            // This is potentially incorrect, since the browser may actually delete more than a single UTF-16
            // character. In reality, a full Unicode grapheme cluster consisting of multiple UTF-16 characters
            // or code points may be deleted. However, in our currently supported locales, there are no such cases.
            // If we support additional locales in the future, this may need to change.
            nextValue =
              selectionEnd === selectionStart
                ? input.value.slice(0, selectionStart) +
                  input.value.slice(selectionEnd == null ? undefined : selectionEnd + 1)
                : input.value.slice(0, selectionStart) + input.value.slice(selectionEnd);
            break;
          case "deleteContentBackward":
            nextValue =
              selectionEnd === selectionStart
                ? input.value.slice(0, selectionStart == null ? undefined : selectionStart - 1) +
                  input.value.slice(selectionStart)
                : input.value.slice(0, selectionStart) + input.value.slice(selectionEnd);
            break;
          case "deleteSoftLineBackward":
          case "deleteHardLineBackward":
            nextValue = input.value.slice(selectionStart);
            break;
          default:
            if (e.data != null) {
              nextValue =
                input.value.slice(0, selectionStart) + e.data + input.value.slice(selectionEnd);
            }
            break;
        }

        // If we did not compute a value, or the new value is invalid, prevent the event
        // so that the browser does not update the input text, move the selection, or add to
        // the undo/redo stack.
        if (nextValue == null || !state.validate(nextValue)) {
          e.preventDefault();
        }
      };

      input.addEventListener("beforeinput", onBeforeInput, false);

      onCleanup(() => {
        input.removeEventListener("beforeinput", onBeforeInput, false);
      });
    })
  );

  const {
    labelProps,
    inputProps: textFieldProps,
    descriptionProps,
    errorMessageProps
  } = createTextField(props, inputRef);

  let compositionStartState: Pick<
    HTMLInputElement,
    "value" | "selectionStart" | "selectionEnd"
  > | null = null;

  const baseInputProps: JSX.InputHTMLAttributes<any> = {
    onBeforeInput: e => {
      if (!supportsNativeBeforeInputEvent()) {
        return;
      }

      const input = e.target as HTMLInputElement;
      const selectionStart = input.selectionStart ?? undefined;
      const selectionEnd = input.selectionEnd ?? undefined;

      const nextValue =
        input.value.slice(0, selectionStart) + e.data + input.value.slice(selectionEnd);

      if (!state().validate(nextValue)) {
        e.preventDefault();
      }
    },
    onCompositionStart: () => {
      const input = inputRef();

      if (!input) {
        return;
      }

      // Chrome does not implement Input Events Level 2, which specifies the insertFromComposition
      // and deleteByComposition inputType values for the beforeinput event. These are meant to occur
      // at the end of a composition (e.g. Pinyin IME, Android auto correct, etc.), and crucially, are
      // cancelable. The insertCompositionText and deleteCompositionText input types are not cancelable,
      // nor would we want to cancel them because the input from the user is incomplete at that point.
      // In Safari, insertFromComposition/deleteFromComposition will fire, however, allowing us to cancel
      // the final composition result if it is invalid. As a fallback for Chrome and Firefox, which either
      // don't support Input Events Level 2, or beforeinput at all, we store the state of the input when
      // the compositionstart event fires, and undo the changes in compositionend (below) if it is invalid.
      // Unfortunately, this messes up the undo/redo stack, but until insertFromComposition/deleteByComposition
      // are implemented, there is no other way to prevent composed input.
      // See https://bugs.chromium.org/p/chromium/issues/detail?id=1022204
      const { value, selectionStart, selectionEnd } = input;
      compositionStartState = { value, selectionStart, selectionEnd };
    },
    onCompositionEnd: () => {
      const input = inputRef();

      if (compositionStartState && input && !state().validate(input.value)) {
        // Restore the input value in the DOM immediately so we can synchronously update the selection position.
        // But also update the value in React state as well so it is correct for future updates.
        const { value, selectionStart, selectionEnd } = compositionStartState;
        input.value = value;
        input.setSelectionRange(selectionStart, selectionEnd);
        state().setInputValue(value);
      }
    }
  };

  const inputProps = combineProps(textFieldProps, baseInputProps);

  return {
    inputProps,
    labelProps,
    descriptionProps,
    errorMessageProps
  };
}
