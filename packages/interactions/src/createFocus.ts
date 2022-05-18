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

import { FocusEvents } from "@solid-aria/types";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo } from "solid-js";

import { createSyntheticBlurEvent } from "./utils";

export interface CreateFocusProps extends FocusEvents {
  /**
   * Whether the focus events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;
}

export interface FocusElementProps {
  /**
   * Handler that is called when the element receives focus.
   */
  onFocus: FocusEvents["onFocus"];

  /**
   * Handler that is called when the element loses focus.
   */
  onBlur: FocusEvents["onBlur"];
}

export interface FocusResult {
  /**
   * Props to spread onto the target element.
   */
  focusProps: Accessor<FocusElementProps>;
}

/**
 * Handles focus events for the target.
 */
export function createFocus(props: CreateFocusProps): FocusResult {
  const onBlur: FocusEvents["onBlur"] = event => {
    if (access(props.isDisabled)) {
      return;
    }

    props.onBlur?.(event);
    props.onFocusChange?.(false);
  };

  const onSyntheticFocus = createSyntheticBlurEvent(onBlur);

  const onFocus: FocusEvents["onFocus"] = event => {
    if (access(props.isDisabled)) {
      return;
    }

    props.onFocus?.(event);
    props.onFocusChange?.(true);
    onSyntheticFocus(event);
  };

  const focusProps: Accessor<FocusElementProps> = createMemo(() => ({
    onFocus,
    onBlur
  }));

  return { focusProps };
}
