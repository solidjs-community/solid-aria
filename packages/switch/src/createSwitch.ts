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
import { AriaValidationProps, Validation } from "@solid-aria/types";
import { Accessor, JSX, mergeProps } from "solid-js";

export type AriaSwitchProps = Omit<AriaToggleProps, keyof (Validation & AriaValidationProps)>;

export interface SwitchAria {
  /**
   * Props for the input element.
   */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;

  /**
   * State for the switch, as returned by `createToggleState`.
   */
  state: ToggleState;
}

/**
 * Provides the behavior and accessibility implementation for a switch component.
 * A switch is similar to a checkbox, but represents on/off values as opposed to selection.
 * @param props - Props for the switch.
 * @param inputRef - Ref to the HTML input element.
 */
export function createSwitch(
  props: AriaSwitchProps,
  inputRef: Accessor<HTMLInputElement | undefined>
): SwitchAria {
  const { inputProps: toggleInputProps, state } = createToggle(props, inputRef);

  const inputProps = mergeProps(toggleInputProps, {
    role: "switch",
    get checked() {
      return state.isSelected();
    },
    get "aria-checked"() {
      return state.isSelected();
    }
  } as JSX.InputHTMLAttributes<HTMLInputElement>);

  return { inputProps, state };
}
