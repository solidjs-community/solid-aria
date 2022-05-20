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

import { createControllableBooleanSignal } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor } from "solid-js";

interface CreateToggleStateProps {
  /**
   * Whether the element should be selected (uncontrolled).
   */
  defaultSelected?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the element should be selected (controlled).
   */
  isSelected?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the element can be selected but not changed by the user.
   */
  isReadOnly?: MaybeAccessor<boolean | undefined>;

  /**
   * Handler that is called when the element's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;
}

export interface ToggleState {
  /**
   * Whether the toggle is selected.
   */
  isSelected: Accessor<boolean>;

  /**
   *  Updates selection state.
   */
  setSelected: (isSelected: boolean) => void;

  /**
   * Toggle the selection state.
   */
  toggle: () => void;
}

/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export function createToggleState(props: CreateToggleStateProps = {}): ToggleState {
  const [isSelected, _setSelected] = createControllableBooleanSignal({
    value: () => access(props.isSelected),
    defaultValue: () => !!access(props.defaultSelected),
    onChange: props.onChange
  });

  const setSelected = (value: boolean) => {
    if (!access(props.isReadOnly)) {
      _setSelected(value);
    }
  };

  const toggle = () => {
    if (!access(props.isReadOnly)) {
      _setSelected(!isSelected());
    }
  };

  return { isSelected, setSelected, toggle };
}
