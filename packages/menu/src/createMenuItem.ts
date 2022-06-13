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

import { getItemCount } from "@solid-aria/collection";
import { createHover, createPress, isKeyboardFocusVisible } from "@solid-aria/interactions";
import { createSelectableItem } from "@solid-aria/selection";
import { ItemKey, PressEvent } from "@solid-aria/types";
import { createSlotId } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, JSX, mergeProps } from "solid-js";

import { useMenuContext } from "./createMenu";

export interface AriaMenuItemProps {
  /**
   * The unique key for the menu item.
   */
  key: ItemKey;

  /**
   * A screen reader only label for the menu item.
   */
  "aria-label"?: string;

  /**
   * Whether the menu should close when the menu item is selected.
   */
  closeOnSelect?: boolean;

  /**
   * Handler that is called when the menu should close after selecting an item.
   */
  onClose?: () => void;

  /**
   * Handler that is called when the user activates the item.
   */
  onAction?: (key: ItemKey) => void;
}

export interface MenuItemAria {
  /**
   * Whether the menu item is currently focused.
   */
  isFocused: Accessor<boolean>;

  /**
   * Whether the menu item is currently selected.
   */
  isSelected: Accessor<boolean>;

  /**
   * Whether the menu item is currently in a pressed state.
   */
  isPressed: Accessor<boolean>;

  /**
   * Whether the menu item is disabled.
   */
  isDisabled: Accessor<boolean>;

  /**
   * Props for the menu item element.
   */
  menuItemProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the main text element inside the menu item.
   */
  labelProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the description text element inside the menu item, if any.
   */
  descriptionProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the keyboard shortcut text element inside the item, if any.
   */
  keyboardShortcutProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for an item in a menu.
 * See `createMenu` for more details about menus.
 * @param props - Props for the item.
 * @param ref - A ref to the menu item element.
 */
export function createMenuItem<T extends HTMLElement>(
  props: AriaMenuItemProps,
  ref: Accessor<T | undefined>
): MenuItemAria {
  const context = useMenuContext();

  const labelId = createSlotId();
  const descriptionId = createSlotId();
  const keyboardId = createSlotId();

  const manager = () => context.state().selectionManager();

  const isDisabled = () => context.state().disabledKeys().has(props.key);
  const isSelected = () => manager().isSelected(props.key);
  const isFocused = () => manager().focusedKey() === props.key;

  const closeOnSelect = () => props.closeOnSelect ?? context.closeOnSelect();

  const onKeyDown = (e: KeyboardEvent) => {
    // Ignore repeating events, which may have started on the menu trigger before moving
    // focus to the menu item. We want to wait for a second complete key press sequence.
    if (e.repeat) {
      return;
    }

    switch (e.key) {
      case " ":
        if (!isDisabled() && manager().selectionMode() === "none" && closeOnSelect()) {
          props.onClose?.();
        }
        break;
      case "Enter":
        // The Enter key should always close on select, except if overridden.
        if (!isDisabled() && closeOnSelect()) {
          props.onClose?.();
        }
        break;
    }
  };

  const onPressStart = (e: PressEvent) => {
    if (e.pointerType === "keyboard") {
      props.onAction?.(props.key);
    }
  };

  const onPressUp = (e: PressEvent) => {
    if (e.pointerType !== "keyboard") {
      props.onAction?.(props.key);

      // Pressing a menu item should close by default in single selection mode but not multiple
      // selection mode, except if overridden by the closeOnSelect prop.
      if (closeOnSelect() ?? manager().selectionMode() !== "multiple") {
        props.onClose?.();
      }
    }
  };

  const { itemProps, isPressed } = createSelectableItem(
    {
      key: () => props.key,
      selectionManager: manager,
      shouldSelectOnPressUp: true,
      allowsDifferentPressOrigin: true,
      isVirtualized: context.isVirtualized,
      isDisabled
    },
    ref
  );

  const { pressProps } = createPress<T>({ isDisabled, onPressStart, onPressUp });

  const { hoverProps } = createHover({
    isDisabled: () => isDisabled() || !context.shouldFocusOnHover(),
    onHoverStart: () => {
      if (!isKeyboardFocusVisible()) {
        manager().setFocused(true);
        manager().setFocusedKey(props.key);
      }
    }
  });

  const baseMenuItemProps: JSX.HTMLAttributes<any> = {
    get role() {
      switch (manager().selectionMode()) {
        case "single":
          return "menuitemradio";
        case "multiple":
          return "menuitemcheckbox";
        default:
          return "menuitem";
      }
    },
    get "aria-disabled"() {
      return isDisabled();
    },
    get "aria-label"() {
      return props["aria-label"];
    },
    get "aria-labelledby"() {
      return labelId();
    },
    get "aria-describedby"() {
      return [descriptionId(), keyboardId()].filter(Boolean).join(" ") || undefined;
    },
    get "aria-checked"() {
      return manager().selectionMode() !== "none" ? isSelected() : undefined;
    },
    get "aria-posinset"() {
      if (!context.isVirtualized()) {
        return undefined;
      }

      const item = context.state().collection().getItem(props.key);

      return item ? item.index + 1 : undefined;
    },
    get "aria-setsize"() {
      if (!context.isVirtualized()) {
        return undefined;
      }

      return getItemCount(context.state().collection());
    }
  };

  const menuItemProps = mergeProps(
    baseMenuItemProps,
    combineProps(itemProps, pressProps, hoverProps, { onKeyDown })
  );

  const labelProps = {
    get id() {
      return labelId();
    }
  };

  const descriptionProps = {
    get id() {
      return descriptionId();
    }
  };

  const keyboardShortcutProps = {
    get id() {
      return keyboardId();
    }
  };

  return {
    isFocused,
    isSelected,
    isDisabled,
    isPressed,
    menuItemProps,
    labelProps,
    descriptionProps,
    keyboardShortcutProps
  };
}
