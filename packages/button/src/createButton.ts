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
import { ElementType } from "@solid-aria/types";
import { filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, createMemo, JSX, mergeProps, splitProps } from "solid-js";

import { AriaButtonProps } from "./types";

export interface ButtonAria<T> {
  /**
   * Props for the button element.
   */
  buttonProps: Accessor<T>;

  /**
   * Whether the button is currently pressed.
   */
  isPressed: Accessor<boolean>;
}

// Order with overrides is important: 'button' should be default
export function createButton(
  props: AriaButtonProps<"button">,
  ref: Accessor<HTMLButtonElement | undefined>
): ButtonAria<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;

export function createButton(
  props: AriaButtonProps<"a">,
  ref: Accessor<HTMLAnchorElement | undefined>
): ButtonAria<JSX.AnchorHTMLAttributes<HTMLAnchorElement>>;

export function createButton(
  props: AriaButtonProps<"div">,
  ref: Accessor<HTMLDivElement | undefined>
): ButtonAria<JSX.HTMLAttributes<HTMLDivElement>>;

export function createButton(
  props: AriaButtonProps<"input">,
  ref: Accessor<HTMLInputElement | undefined>
): ButtonAria<JSX.InputHTMLAttributes<HTMLInputElement>>;

export function createButton(
  props: AriaButtonProps<"span">,
  ref: Accessor<HTMLSpanElement | undefined>
): ButtonAria<JSX.HTMLAttributes<HTMLSpanElement>>;

export function createButton(
  props: AriaButtonProps<ElementType>,
  ref: Accessor<HTMLElement | undefined>
): ButtonAria<JSX.HTMLAttributes<HTMLElement>>;

/**
 * Provides the behavior and accessibility implementation for a button component. Handles mouse, keyboard, and touch interactions,
 * focus behavior, and ARIA props for both native button elements and custom element types.
 * @param props - Props to be applied to the button.
 * @param ref - A ref to a DOM element for the button.
 */
export function createButton(
  props: AriaButtonProps<ElementType>,
  ref: Accessor<any>
): ButtonAria<JSX.HTMLAttributes<any>> {
  const defaultProps: AriaButtonProps<"button"> = {
    elementType: "button",
    type: "button"
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const additionalProps = createMemo(() => {
    if (props.elementType === "button") {
      return {
        type: props.type,
        disabled: props.isDisabled
      };
    }

    return {
      role: "button",
      tabIndex: props.isDisabled ? undefined : 0,
      href: props.elementType === "a" && props.isDisabled ? undefined : props.href,
      target: props.elementType === "a" ? props.target : undefined,
      type: props.elementType === "input" ? props.type : undefined,
      disabled: props.elementType === "input" ? props.isDisabled : undefined,
      "aria-disabled":
        !props.isDisabled || props.elementType === "input" ? undefined : props.isDisabled,
      rel: props.elementType === "a" ? props.rel : undefined
    };
  });

  const [createPressProps] = splitProps(props, [
    "onPressStart",
    "onPressEnd",
    "onPressChange",
    "onPress",
    "isDisabled",
    "preventFocusOnPress"
  ]);

  const { pressProps, isPressed } = createPress(createPressProps, ref);

  const { focusableProps } = createFocusable(props, ref);

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  const onClick = (e: MouseEvent) => {
    if (!props.onClick) {
      return;
    }

    props.onClick(e);
    console.warn("onClick is deprecated, please use onPress");
  };

  const buttonProps = createMemo(() => {
    return combineProps(additionalProps(), focusableProps, pressProps(), domProps(), {
      "aria-haspopup": props["aria-haspopup"],
      "aria-expanded": props["aria-expanded"],
      "aria-controls": props["aria-controls"],
      "aria-pressed": props["aria-pressed"],
      tabIndex: props.allowFocusWhenDisabled && props.isDisabled ? -1 : focusableProps.tabIndex,
      onClick
    }) as JSX.HTMLAttributes<any>;
  });

  return { buttonProps, isPressed };
}
