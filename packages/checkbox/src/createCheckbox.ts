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

import { AriaToggleProps, createToggle, ToggleState } from "@solid-aria/toggle";
import { access } from "@solid-primitives/utils";
import { Accessor, createEffect, JSX, mergeProps, on } from "solid-js";

export interface AriaCheckboxProps extends AriaToggleProps {
  /**
   * Indeterminism is presentational only.
   * The indeterminate visual representation remains regardless of user interaction.
   */
  isIndeterminate?: boolean;
}

export interface CheckboxAria {
  /**
   * Props for the input element.
   */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;

  /**
   * State for the checkbox, as returned by `createToggleState`.
   */
  state: ToggleState;
}

/**
 * Provides the behavior and accessibility implementation for a checkbox component.
 * Checkboxes allow users to select multiple items from a list of individual items,
 * or to mark one individual item as selected.
 * @param props - Props for the checkbox.
 * @param inputRef - A ref for the HTML input element.
 */
export function createCheckbox(
  props: AriaCheckboxProps,
  inputRef: Accessor<HTMLInputElement | undefined>
): CheckboxAria {
  const { inputProps: toggleInputProps, state } = createToggle(props, inputRef);

  // indeterminate is a property, but it can only be set via javascript
  // https://css-tricks.com/indeterminate-checkboxes/
  createEffect(() => {
    const input = access(inputRef);

    if (input) {
      input.indeterminate = props.isIndeterminate || false;
    }
  });

  // Unlike in React, inputs `indeterminate` state can be out of sync with our `props.isIndeterminate`.
  // Clicking on the input will change its internal `indeterminate` state.
  // To prevent this, we need to force the input `indeterminate` state to be in sync with our `props.isIndeterminate`.
  createEffect(
    on(
      () => state.isSelected(),
      () => {
        const input = access(inputRef);

        if (input) {
          input.indeterminate = props.isIndeterminate || false;
        }
      }
    )
  );

  const inputProps = mergeProps(toggleInputProps, {
    get checked() {
      return state.isSelected();
    },
    get "aria-checked"() {
      return props.isIndeterminate ? "mixed" : state.isSelected();
    }
  });

  return { inputProps, state };
}
