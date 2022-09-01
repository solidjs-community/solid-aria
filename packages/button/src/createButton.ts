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
/* eslint-disable solid/reactivity */

import { createFocusable, CreateFocusableProps } from "@solid-aria/focus";
import { createPress } from "@solid-aria/interactions";
import { ElementType } from "@solid-aria/types";
import { combineProps } from "@solid-primitives/props";
import { Accessor, JSX, mergeProps, splitProps } from "solid-js";

import { AriaButtonProps, ElementOfType, PropsOfType } from "./types";

export interface ButtonAria<T extends ElementType> {
  /**
   * A ref to apply onto the target element.
   * Merge the given `props.ref` and all parents `PressResponder` refs.
   */
  ref: (el: ElementOfType<T>) => void;

  /**
   * Props for the button element.
   */
  buttonProps: Omit<PropsOfType<T>, "ref">;

  /**
   * Whether the button is currently pressed.
   */
  isPressed: Accessor<boolean>;
}

/**
 * Provides the behavior and accessibility implementation for a button component. Handles mouse, keyboard, and touch interactions,
 * focus behavior, and ARIA props for both native button elements and custom element types.
 * @param props - Props to be applied to the button.
 */
export function createButton<T extends ElementType>(props: AriaButtonProps<T>): ButtonAria<T> {
  props = mergeProps({ elementType: "button", type: "button" }, props) as typeof props;

  const additionalButtonElementProps: JSX.ButtonHTMLAttributes<any> = {
    get type() {
      return props.type;
    },
    get disabled() {
      return props.isDisabled;
    }
  };

  const additionalOtherElementProps: JSX.AnchorHTMLAttributes<any> | JSX.InputHTMLAttributes<any> =
    {
      role: "button",
      get tabIndex() {
        return props.isDisabled ? undefined : 0;
      },
      get href() {
        return props.elementType === "a" && props.isDisabled ? undefined : props.href;
      },
      get target() {
        return props.elementType === "a" ? props.target : undefined;
      },
      get type() {
        return props.elementType === "input" ? props.type : undefined;
      },
      get disabled() {
        return props.elementType === "input" ? props.isDisabled : undefined;
      },
      get "aria-disabled"() {
        return !props.isDisabled || props.elementType === "input" ? undefined : props.isDisabled;
      },
      get rel() {
        return props.elementType === "a" ? props.rel : undefined;
      }
    };

  const additionalProps = mergeProps(() =>
    props.elementType === "button" ? additionalButtonElementProps : additionalOtherElementProps
  );

  const [createPressProps] = splitProps(props, [
    "onPressStart",
    "onPressEnd",
    "onPressChange",
    "onPress",
    "isDisabled",
    "preventFocusOnPress"
  ]);

  const { pressProps, isPressed, ref: pressRef } = createPress(createPressProps);

  // createFocusable has problems with the `props` type because if you pass a component as the `elementType` prop, there is no telling if the `ref` will be a HTML Element.
  const { focusableProps, ref: focusRef } = createFocusable(
    props as CreateFocusableProps<HTMLElement>
  );

  const baseButtonProps: JSX.HTMLAttributes<any> = {
    get "aria-haspopup"() {
      return props["aria-haspopup"];
    },
    get "aria-expanded"() {
      return props["aria-expanded"];
    },
    get "aria-controls"() {
      return props["aria-controls"];
    },
    get "aria-pressed"() {
      return props["aria-pressed"];
    },
    get tabIndex() {
      return props.allowFocusWhenDisabled && props.isDisabled ? -1 : focusableProps.tabIndex;
    },
    onClick: e => {
      if (!props.onClick) {
        return;
      }

      props.onClick(e);
      console.warn("onClick is deprecated, please use onPress");
    }
  };

  const buttonProps = combineProps(
    additionalProps,
    focusableProps,
    pressProps,
    baseButtonProps
  ) as Omit<PropsOfType<T>, "ref">;

  return {
    buttonProps,
    isPressed,
    ref: el => {
      focusRef(el as HTMLElement);
      pressRef(el as HTMLElement);
    }
  };
}
