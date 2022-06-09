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

import { createFocusable, CreateFocusableProps } from "@solid-aria/focus";
import { createPress } from "@solid-aria/interactions";
import { AriaLabelingProps, DOMProps, FocusableProps } from "@solid-aria/types";
import { filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, createMemo, JSX } from "solid-js";

import { useRadioGroupContext } from "./createRadioGroup";
import { RadioGroupState } from "./createRadioGroupState";

export interface AriaRadioProps extends FocusableProps, DOMProps, AriaLabelingProps {
  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string;

  /**
   * Whether the radio button is disabled or not.
   * Shows that a selection exists, but is not available in that circumstance.
   */
  isDisabled?: boolean;

  /**
   * The label for the Radio.
   */
  children?: JSX.Element;
}

interface RadioAria {
  /**
   * Props for the input element.
   */
  inputProps: Accessor<JSX.InputHTMLAttributes<HTMLInputElement>>;

  /**
   * State for the radio group, as returned by `createRadioGroupState`.
   */
  state: RadioGroupState;
}

/**
 * Provides the behavior and accessibility implementation for an individual
 * radio button in a radio group.
 * @param props - Props for the radio.
 * @param inputRef - Ref to the HTML input element.
 */
export function createRadio(
  props: AriaRadioProps,
  inputRef: Accessor<HTMLInputElement | undefined>
): RadioAria {
  const context = useRadioGroupContext();

  const isDisabled = () => {
    return props.isDisabled || context.state.isDisabled();
  };

  const isChecked = () => {
    return context.state.isSelected(props.value);
  };

  const isLastFocused = () => {
    return context.state.lastFocusedValue() === props.value;
  };

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = event => {
    // since we spread props on label, onChange will end up there as well as in here.
    // so we have to stop propagation at the lowest level that we care about
    event.stopPropagation();

    context.state.setSelectedValue(props.value);

    const target = event.target as HTMLInputElement;

    // Unlike in React, inputs `checked` state can be out of sync with our toggle state.
    // for example a readonly `<input type="radio" />` is always "checkable".
    //
    // Also even if an input is controlled (ex: `<input type="radio" checked={isChecked} />`,
    // clicking on the input will change its internal `checked` state.
    //
    // To prevent this, we need to force the input `checked` state to be in sync with the toggle state.
    target.checked = isChecked();
  };

  const { pressProps } = createPress<HTMLInputElement>({
    isDisabled: () => props.isDisabled
  });

  const createFocusableProps = combineProps(props, {
    onFocus: () => context.state.setLastFocusedValue(props.value)
  } as CreateFocusableProps);

  const { focusableProps } = createFocusable(createFocusableProps, inputRef);

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  const tabIndex = createMemo(() => {
    if (isDisabled()) {
      return undefined;
    }

    return isLastFocused() || context.state.lastFocusedValue() == null ? 0 : -1;
  });

  const inputProps: Accessor<JSX.InputHTMLAttributes<HTMLInputElement>> = createMemo(() => {
    return combineProps(domProps(), pressProps, focusableProps, {
      type: "radio",
      name: context.name(),
      tabIndex: tabIndex(),
      disabled: isDisabled(),
      checked: isChecked(),
      value: props.value,
      onChange
    });
  });

  return { inputProps, state: context.state };
}
