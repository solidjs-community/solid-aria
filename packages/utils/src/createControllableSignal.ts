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

import { access, accessWith, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo, createSignal, untrack } from "solid-js";

export interface CreateControllableSignalProps<T> {
  /**
   * The value to be used, in controlled mode.
   */
  value?: MaybeAccessor<T | undefined>;

  /**
   * The initial value to be used, in uncontrolled mode.
   */
  defaultValue?: MaybeAccessor<T | undefined>;

  /**
   * The callback fired when the value changes.
   */
  onChange?: (value: T) => void;
}

/**
 * Creates a simple reactive state with a getter and setter,
 * that can be controlled with `value` and `onChange` props.
 */
export function createControllableSignal<T>(props: CreateControllableSignalProps<T>) {
  // Internal uncontrolled value
  // eslint-disable-next-line solid/reactivity
  const [_value, _setValue] = createSignal(access(props.defaultValue));

  const isControlled = createMemo(() => access(props.value) !== undefined);

  const value = createMemo(() => (isControlled() ? access(props.value) : _value()));

  const setValue = (next: Exclude<T, Function> | ((prev: T) => T)) => {
    untrack(() => {
      const nextValue = accessWith(next, value() as T);

      if (!Object.is(nextValue, value())) {
        if (!isControlled()) {
          _setValue(nextValue as Exclude<T, Function>);
        }

        props.onChange?.(nextValue);
      }

      return nextValue;
    });
  };

  return [value, setValue] as const;
}

/**
 * Creates a simple reactive boolean state with a getter, setter and a fallback value of `false`,
 * that can be controlled with `value` and `onChange` props.
 */
export function createControllableBooleanSignal(props: CreateControllableSignalProps<boolean>) {
  const [_value, setValue] = createControllableSignal(props);

  const value: Accessor<boolean> = () => _value() ?? false;

  return [value, setValue] as const;
}

/**
 * Creates a simple reactive array state with a getter, setter and a fallback value of `[]`,
 * that can be controlled with `value` and `onChange` props.
 */
export function createControllableArraySignal<T>(props: CreateControllableSignalProps<Array<T>>) {
  const [_value, setValue] = createControllableSignal(props);

  const value: Accessor<Array<T>> = () => _value() ?? [];

  return [value, setValue] as const;
}
