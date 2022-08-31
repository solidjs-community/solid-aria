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

import {
  createFocus,
  CreateFocusProps,
  createKeyboard,
  CreateKeyboardProps
} from "@solid-aria/interactions";
import { combineProps } from "@solid-primitives/props";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createSignal, JSX, onMount } from "solid-js";

export interface CreateFocusableProps extends CreateFocusProps, CreateKeyboardProps {
  /**
   * Whether focus should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the element should receive focus on render.
   */
  autofocus?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether to exclude the element from the sequential tab order. If true,
   * the element will not be focusable via the keyboard by tabbing. This should
   * be avoided except in rare scenarios where an alternative means of accessing
   * the element or its functionality via the keyboard is available.
   */
  excludeFromTabOrder?: MaybeAccessor<boolean | undefined>;
}

export interface FocusableResult {
  /**
   * Props to spread onto the target element.
   */
  focusableProps: JSX.HTMLAttributes<any>;
}

// TODO: add all the focus provider stuff when needed

/**
 * Make an element focusable, capable of auto focus and excludable from tab order.
 */
export function createFocusable(
  props: CreateFocusableProps,
  ref: Accessor<HTMLElement | undefined>
): FocusableResult {
  const [autofocus, setAutofocus] = createSignal(!!access(props.autofocus));

  const { focusProps } = createFocus(props);
  const { keyboardProps } = createKeyboard(props);

  const focusableProps = {
    ...combineProps(focusProps, keyboardProps),
    get tabIndex() {
      return access(props.excludeFromTabOrder) && !access(props.isDisabled) ? -1 : undefined;
    }
  };

  onMount(() => {
    autofocus() && ref()?.focus();
    setAutofocus(false);
  });

  return { focusableProps };
}
