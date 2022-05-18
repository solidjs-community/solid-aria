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

import { KeyboardEvents } from "@solid-aria/types";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo } from "solid-js";

export interface CreateKeyboardProps extends KeyboardEvents {
  /**
   * Whether the keyboard events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;
}

export interface KeyboardElementProps {
  /**
   * Handler that is called when a key is pressed.
   */
  onKeyDown: KeyboardEvents["onKeyDown"];

  /**
   * Handler that is called when a key is released.
   */
  onKeyUp: KeyboardEvents["onKeyUp"];
}

export interface KeyboardResult {
  /**
   * Props to spread onto the target element.
   */
  keyboardProps: Accessor<KeyboardElementProps>;
}

/**
 * Handles keyboard events for the target.
 */
export function createKeyboard(props: CreateKeyboardProps): KeyboardResult {
  const onKeyDown: CreateKeyboardProps["onKeyDown"] = event => {
    if (access(props.isDisabled)) {
      return;
    }

    props.onKeyDown?.(event);
  };

  const onKeyUp: CreateKeyboardProps["onKeyUp"] = event => {
    if (access(props.isDisabled)) {
      return;
    }

    props.onKeyUp?.(event);
  };

  const keyboardProps: Accessor<KeyboardElementProps> = createMemo(() => ({
    onKeyDown,
    onKeyUp
  }));

  return { keyboardProps };
}
