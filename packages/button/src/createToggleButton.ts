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

import { createToggleState, ToggleState } from "@solid-aria/toggle";
import { ElementType } from "@solid-aria/types";
import { combineProps } from "@solid-primitives/props";
import { chain } from "@solid-primitives/utils";
import { Accessor, createMemo, JSX, mergeProps } from "solid-js";

import { ButtonAria, createButton } from "./createButton";
import { AriaToggleButtonProps } from "./types";

export interface ToggleButtonAria<T> extends ButtonAria<T> {
  /**
   * State for the toggle button, as returned by `createToggleState`.
   */
  state: ToggleState;
}

export function createToggleButton(
  props: AriaToggleButtonProps<"a">,
  ref: Accessor<HTMLAnchorElement | undefined>
): ToggleButtonAria<JSX.AnchorHTMLAttributes<HTMLAnchorElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<"button">,
  ref: Accessor<HTMLButtonElement | undefined>
): ToggleButtonAria<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<"div">,
  ref: Accessor<HTMLDivElement | undefined>
): ToggleButtonAria<JSX.HTMLAttributes<HTMLDivElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<"input">,
  ref: Accessor<HTMLInputElement | undefined>
): ToggleButtonAria<JSX.InputHTMLAttributes<HTMLInputElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<"span">,
  ref: Accessor<HTMLSpanElement | undefined>
): ToggleButtonAria<JSX.HTMLAttributes<HTMLSpanElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<ElementType>,
  ref: Accessor<HTMLElement | undefined>
): ToggleButtonAria<JSX.HTMLAttributes<HTMLElement>>;

/**
 * Provides the behavior and accessibility implementation for a toggle button component.
 * ToggleButtons allow users to toggle a selection on or off, for example switching between two states or modes.
 * @param props - Props to be applied to the button.
 * @param ref - A ref to a DOM element for the button.
 */
export function createToggleButton(
  props: AriaToggleButtonProps<ElementType>,
  ref: Accessor<any>
): ToggleButtonAria<JSX.HTMLAttributes<any>> {
  const state = createToggleState(props);

  const createButtonProps = mergeProps(props, {
    onPress: chain([state.toggle, props.onPress])
  });

  const { isPressed, buttonProps: baseButtonProps } = createButton(createButtonProps, ref);

  const buttonProps = createMemo(() => {
    return combineProps(baseButtonProps, { "aria-pressed": state.isSelected() });
  });

  return { buttonProps, isPressed, state };
}
