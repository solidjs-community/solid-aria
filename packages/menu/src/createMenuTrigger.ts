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

import { AriaButtonProps } from "@solid-aria/button";
import { createLongPress, CreatePressProps } from "@solid-aria/interactions";
import { createOverlayTrigger, CreateOverlayTriggerStateProps } from "@solid-aria/overlays";
import { createId } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, createMemo, JSX, mergeProps } from "solid-js";

import { createMenuTriggerState, MenuTriggerState } from "./createMenuTriggerState";
import { MenuTriggerType } from "./types";

export interface AriaMenuTriggerProps extends CreateOverlayTriggerStateProps {
  /**
   * The type of menu that the menu trigger opens.
   */
  type?: "menu" | "listbox";

  /**
   * Whether menu trigger is disabled.
   */
  isDisabled?: boolean;

  /**
   * How menu is triggered.
   * @default 'press'
   */
  trigger?: MenuTriggerType;

  /**
   * A description for assistive techology users indicating that a long press
   * action is available, e.g. "Long press to open menu".
   */
  accessibilityDescription?: string;
}

export interface MenuTriggerAria {
  /**
   * Props for the menu trigger element.
   */
  menuTriggerProps: AriaButtonProps;

  /**
   * Props for the menu.
   */
  menuProps: JSX.HTMLAttributes<any>;

  /**
   * State for the menu trigger, as returned by `createMenuTriggerState`.
   */
  state: MenuTriggerState;
}

/**
 * Provides the behavior and accessibility implementation for a menu trigger.
 * @param props - Props for the menu trigger.
 * @param ref - A ref to the menu trigger element.
 * @param state - State for the menu trigger, as returned by `createMenuTriggerState`.
 */
export function createMenuTrigger<T extends HTMLElement>(
  props: AriaMenuTriggerProps,
  ref: Accessor<T | undefined>,
  state: MenuTriggerState = createMenuTriggerState(props)
): MenuTriggerAria {
  const defaultProps: Partial<AriaMenuTriggerProps> = {
    type: "menu",
    trigger: "press",
    accessibilityDescription: "Long press or press Alt + ArrowDown to open menu"
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const menuTriggerId = createId();

  const { triggerProps, overlayProps } = createOverlayTrigger(
    { type: () => props.type ?? "menu" },
    state
  );

  const onKeyDown = (e: KeyboardEvent) => {
    const refEl = ref();

    if (!refEl || props.isDisabled || (props.trigger === "longPress" && !e.altKey)) {
      return;
    }

    switch (e.key) {
      case "Enter":
      case " ":
        if (props.trigger === "longPress") {
          return;
        }
      // fallthrough
      case "ArrowDown":
        e.stopPropagation();
        e.preventDefault();
        state.toggle("first");
        break;
      case "ArrowUp":
        e.stopPropagation();
        e.preventDefault();
        state.toggle("last");
        break;
    }
  };

  const { longPressProps } = createLongPress<T>({
    isDisabled: () => props.isDisabled || props.trigger !== "longPress",
    accessibilityDescription: () => props.accessibilityDescription,
    onLongPressStart: () => state.close(),
    onLongPress: () => state.open("first")
  });

  const pressProps: Pick<CreatePressProps<T>, "onPressStart" | "onPress"> = {
    onPressStart: e => {
      // For consistency with native, open the menu on mouse/key down, but touch up.
      if (e.pointerType !== "touch" && e.pointerType !== "keyboard" && !props.isDisabled) {
        // If opened with a screen reader, auto focus the first item.
        // Otherwise, the menu itself will be focused.
        state.toggle(e.pointerType === "virtual" ? "first" : undefined);
      }
    },
    onPress: e => {
      if (e.pointerType === "touch" && !props.isDisabled) {
        state.toggle();
      }
    }
  };

  const combinedTriggerProps = createMemo(() => {
    return combineProps(
      triggerProps,
      props.trigger === "press" ? pressProps : {},
      props.trigger === "longPress" ? longPressProps : {}
    ) as AriaButtonProps;
  });

  const baseMenuTriggerProps: AriaButtonProps = {
    id: menuTriggerId,
    onKeyDown
  };

  const baseMenuProps: JSX.HTMLAttributes<any> = {
    "aria-labelledby": menuTriggerId
  };

  return {
    menuTriggerProps: mergeProps(combinedTriggerProps, baseMenuTriggerProps),
    menuProps: mergeProps(overlayProps, baseMenuProps),
    state
  };
}
