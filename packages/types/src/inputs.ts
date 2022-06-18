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

import { JSX } from "solid-js";

export type ValidationState = "valid" | "invalid";

export interface Validation {
  /**
   * Whether the input should display its "valid" or "invalid" visual styling.
   */
  validationState?: ValidationState;

  /**
   * Whether user input is required on the input before form submission.
   * Often paired with the `necessityIndicator` prop to add a visual indicator to the input.
   */
  isRequired?: boolean;
}

export interface AriaValidationProps {
  /**
   * Identifies the element that provides an error message for the object.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage
   */
  "aria-errormessage"?: string;
}

export interface InputBase {
  /**
   * Whether the input is disabled.
   */
  isDisabled?: boolean;

  /**
   * Whether the input can be selected but not changed by the user.
   */
  isReadOnly?: boolean;
}

export interface ValueBase<T, C = T> {
  /**
   * The current value (controlled).
   */
  value?: T;

  /**
   * The default value (uncontrolled).
   */
  defaultValue?: T;

  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: C) => void;
}

export interface TextInputBase {
  /**
   * Temporary text that occupies the text input when it is empty.
   */
  placeholder?: string;
}

export interface HelpTextProps {
  /**
   * A description for the field. Provides a hint such as specific requirements for what to choose.
   */
  description?: JSX.Element;

  /**
   * An error message for the field.
   */
  errorMessage?: JSX.Element;
}
