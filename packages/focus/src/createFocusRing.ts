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

import {
  createFocus,
  createFocusVisibleListener,
  createFocusWithin,
  FocusElementProps,
  FocusWithinElementProps,
  isKeyboardFocusVisible
} from "@solid-aria/interactions";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createSignal } from "solid-js";

export interface CreateFocusRingProps {
  /**
   * Whether to show the focus ring when something
   * inside the container element has focus (true), or
   * only if the container itself has focus (false).
   * @default 'false'
   */
  within?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the element is a text input.
   */
  isTextInput?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the element will be auto focused.
   */
  autoFocus?: MaybeAccessor<boolean | undefined>;
}

export interface FocusRingResult {
  /**
   * Whether the element is currently focused.
   */
  isFocused: Accessor<boolean>;

  /**
   * Whether keyboard focus should be visible.
   */
  isFocusVisible: Accessor<boolean>;

  /**
   * Props to apply to the container element with the focus ring.
   */
  focusProps: Accessor<FocusElementProps | FocusWithinElementProps>;
}

/**
 * Determines whether a focus ring should be shown to indicate keyboard focus.
 * Focus rings are visible only when the user is interacting with a keyboard,
 * not with a mouse, touch, or other input methods.
 */
export function createFocusRing(props: CreateFocusRingProps = {}): FocusRingResult {
  const [isFocused, setFocused] = createSignal(false);
  const [isFocusVisibleState, setFocusVisibleState] = createSignal(
    access(props.autoFocus) || isKeyboardFocusVisible()
  );

  const isFocusVisible = () => isFocused() && isFocusVisibleState();

  createFocusVisibleListener(
    setFocusVisibleState,
    () => null, // hack for passing a dep that never changes
    { isTextInput: !!access(props.isTextInput) }
  );

  const { focusProps: _focusProps } = createFocus({
    isDisabled: () => access(props.within),
    onFocusChange: setFocused
  });

  const { focusWithinProps } = createFocusWithin({
    isDisabled: () => !access(props.within),
    onFocusWithinChange: setFocused
  });

  const focusProps = () => {
    return access(props.within) ? focusWithinProps() : _focusProps();
  };

  return { isFocused, isFocusVisible, focusProps };
}

/*
export function createFocusRing(props: CreateFocusRingProps = {}): FocusRingResult {
  const state = {
    isFocused: false,
    isFocusVisible: access(props.autoFocus) || isKeyboardFocusVisible()
  };

  const [isFocused, setFocused] = createSignal(false);
  const [isFocusVisibleState, setFocusVisibleState] = createSignal(false);

  const updateState = () => setFocusVisibleState(state.isFocused && state.isFocusVisible);

  const onFocusChange = (isFocused: boolean) => {
    state.isFocused = isFocused;
    setFocused(isFocused);
    updateState();
  };

  createFocusVisibleListener(
    isFocusVisible => {
      state.isFocusVisible = isFocusVisible;
      updateState();
    },
    () => null, // hack for passing a dep that never changes
    { isTextInput: !!access(props.isTextInput) }
  );

  const isFocusVisible = () => state.isFocused && isFocusVisibleState();

  const { focusProps: _focusProps } = createFocus({
    isDisabled: () => access(props.within),
    onFocusChange
  });

  const { focusWithinProps } = createFocusWithin({
    isDisabled: () => !access(props.within),
    onFocusWithinChange: onFocusChange
  });

  const focusProps = () => {
    return access(props.within) ? focusWithinProps() : _focusProps();
  };

  return {
    isFocused,
    isFocusVisible,
    focusProps
  };
}
*/
