/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Accessor, mergeProps } from "solid-js";

import { AriaCheckboxProps, CheckboxAria, createCheckbox } from "./createCheckbox";
import { useCheckboxGroupContext } from "./createCheckboxGroup";
import { CheckboxGroupState } from "./createCheckboxGroupState";

export interface AriaCheckboxGroupItemProps
  extends Omit<AriaCheckboxProps, "isSelected" | "defaultSelected"> {
  value: string;
}

export interface CheckboxGroupItemAria extends Omit<CheckboxAria, "state"> {
  /**
   * State for the checkbox group, as returned by `createCheckboxGroupState`.
   */
  state: CheckboxGroupState;
}

/**
 * Provides the behavior and accessibility implementation for a checkbox component contained within a checkbox group.
 * Checkbox groups allow users to select multiple items from a list of options.
 * @param props - Props for the checkbox.
 * @param inputRef - A ref for the HTML input element.
 */
export function createCheckboxGroupItem(
  props: AriaCheckboxGroupItemProps,
  inputRef: Accessor<HTMLInputElement | undefined>
): CheckboxGroupItemAria {
  const context = useCheckboxGroupContext();

  const onChange = (isSelected: boolean) => {
    if (props.isDisabled || context.state.isDisabled()) {
      return;
    }

    isSelected ? context.state.addValue(props.value) : context.state.removeValue(props.value);

    props.onChange?.(isSelected);
  };

  const createCheckboxProps = mergeProps(props, {
    get isReadOnly() {
      return props.isReadOnly || context.state.isReadOnly();
    },
    get isSelected() {
      return context.state.isSelected(props.value);
    },
    get isDisabled() {
      return props.isDisabled || context.state.isDisabled();
    },
    get name() {
      return props.name || context.name();
    },
    onChange
  });

  const { inputProps } = createCheckbox(createCheckboxProps, inputRef);

  return { inputProps, state: context.state };
}
