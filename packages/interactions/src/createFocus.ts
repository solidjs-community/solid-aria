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

import { FocusEvents } from "@solid-aria/types";
import { access, MaybeAccessor } from "@solid-primitives/utils";

import { createSyntheticBlurEvent } from "./utils";

export interface CreateFocusProps extends FocusEvents {
  /**
   * Whether the focus events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;
}

type FocusProps = Required<Pick<FocusEvents, "onFocus" | "onBlur">>;

export interface FocusResult {
  /**
   * Props to spread onto the target element.
   */
  focusProps: FocusProps;
}

/**
 * Handles focus events for the immediate target.
 * Focus events on child elements will be ignored.
 */
export function createFocus(props: CreateFocusProps): FocusResult {
  const isDisabled = () => access(props.isDisabled) ?? false;

  const onBlur = (e: FocusEvent) => {
    if (isDisabled() || (!props.onBlur && !props.onFocusChange)) {
      return;
    }

    props.onBlur?.(e);
    props.onFocusChange?.(false);
  };

  const onSyntheticFocus = createSyntheticBlurEvent(onBlur);

  const onFocus = (e: FocusEvent) => {
    if (isDisabled() || (!props.onFocus && !props.onBlur && !props.onFocusChange)) {
      return;
    }

    props.onFocus?.(e);
    props.onFocusChange?.(true);
    onSyntheticFocus(e);
  };

  const focusProps: FocusProps = {
    onFocus,
    onBlur
  };

  return { focusProps };
}
