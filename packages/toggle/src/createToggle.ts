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

import { createFocusable } from "@solid-aria/focus";
import { createPress } from "@solid-aria/interactions";
import {
  AriaLabelingProps,
  AriaValidationProps,
  FocusableDOMProps,
  FocusableProps,
  InputBase,
  Validation
} from "@solid-aria/types";
import { filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, JSX, mergeProps } from "solid-js";

import { createToggleState, ToggleState } from "./createToggleState";

export interface AriaToggleProps
  extends InputBase,
    Validation,
    FocusableProps,
    FocusableDOMProps,
    AriaLabelingProps,
    AriaValidationProps {
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   */
  "aria-controls"?: string;

  /**
   * The label for the element.
   */
  children?: JSX.Element;

  /**
   * Whether the element should be selected (uncontrolled).
   */
  defaultSelected?: boolean;

  /**
   * Whether the element should be selected (controlled).
   */
  isSelected?: boolean;

  /**
   * The value of the input element, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
   */
  value?: string;

  /**
   * The name of the input element, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string;

  /**
   * Handler that is called when the element's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;
}

export interface ToggleAria {
  /**
   * Props to be spread on the input element.
   */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;

  /**
   * State for the toggle element, as returned by `createToggleState`.
   */
  state: ToggleState;
}

/**
 * Handles interactions for toggle elements, e.g. Checkboxes and Switches.
 * @param props - Props for the toggle element.
 * @param inputRef - Ref to the HTML input element.
 */
export function createToggle(
  props: AriaToggleProps,
  inputRef: Accessor<HTMLInputElement | undefined>
): ToggleAria {
  const defaultProps: AriaToggleProps = {
    isDisabled: false,
    validationState: "valid"
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const state = createToggleState(props);

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = event => {
    // since we spread props on label, onChange will end up there as well as in here.
    // so we have to stop propagation at the lowest level that we care about
    event.stopPropagation();

    const target = event.target as HTMLInputElement;

    state.setSelected(target.checked);

    // Unlike in React, inputs `checked` state can be out of sync with our toggle state.
    // for example a readonly `<input type="checkbox" />` is always "checkable".
    //
    // Also even if an input is controlled (ex: `<input type="checkbox" checked={isChecked} />`,
    // clicking on the input will change its internal `checked` state.
    //
    // To prevent this, we need to force the input `checked` state to be in sync with the toggle state.
    target.checked = state.isSelected();
  };

  // This handles focusing the input on pointer down, which Safari does not do by default.
  const { pressProps } = createPress<HTMLInputElement>({
    isDisabled: () => props.isDisabled
  });

  const { focusableProps } = createFocusable(props, inputRef);
  const domProps = filterDOMProps(props, { labelable: true });

  const baseToggleProps: JSX.InputHTMLAttributes<any> = {
    get "aria-invalid"() {
      return props.validationState === "invalid" || undefined;
    },
    get "aria-errormessage"() {
      return props["aria-errormessage"];
    },
    get "aria-controls"() {
      return props["aria-controls"];
    },
    get "aria-readonly"() {
      return props.isReadOnly || undefined;
    },
    get "aria-required"() {
      return props.isRequired || undefined;
    },
    get disabled() {
      return props.isDisabled;
    },
    get value() {
      return props.value;
    },
    get name() {
      return props.name;
    },
    type: "checkbox",
    onChange
  };

  const inputProps = combineProps(domProps, baseToggleProps, pressProps, focusableProps);

  return { inputProps, state };
}
