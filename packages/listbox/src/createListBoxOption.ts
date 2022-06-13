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
import { createHover, isKeyboardFocusVisible } from "@solid-aria/interactions";
import { createSelectableItem } from "@solid-aria/selection";
import { ItemKey } from "@solid-aria/types";
import { createSlotId } from "@solid-aria/utils";
import { isMac, isWebKit } from "@solid-primitives/platform";
import { combineProps } from "@solid-primitives/props";
import { Accessor, JSX } from "solid-js";

import { useListBoxContext } from "./createListBox";
import { getItemId } from "./utils";

export interface AriaListBoxOptionProps {
  /**
   * The unique key for the option.
   */
  key: ItemKey;

  /**
   * A screen reader only label for the option.
   */
  "aria-label"?: string;
}

interface ListBoxOptionAria {
  /**
   * Whether the option is currently focused.
   */
  isFocused: Accessor<boolean>;

  /**
   * Whether the option is currently selected.
   */
  isSelected: Accessor<boolean>;

  /**
   * Whether the option is currently in a pressed state.
   */
  isPressed: Accessor<boolean>;

  /**
   * Whether the option is disabled.
   */
  isDisabled: Accessor<boolean>;

  /**
   * Props for the option element.
   */
  optionProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the main text element inside the option.
   */
  labelProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the description text element inside the option, if any.
   */
  descriptionProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for an option in a listbox.
 * See `useListBox` for more details about listboxes.
 * @param props - Props for the option.
 * @param ref - A ref to the option element..
 */
export function createListBoxOption<T extends HTMLElement>(
  props: AriaListBoxOptionProps,
  ref: Accessor<T | undefined>
): ListBoxOptionAria {
  const context = useListBoxContext();

  const labelId = createSlotId();
  const descriptionId = createSlotId();

  const manager = () => context.state().selectionManager();

  const isDisabled = () => context.state().disabledKeys().has(props.key);
  const isSelected = () => manager().isSelected(props.key);
  const isFocused = () => manager().focusedKey() === props.key;

  const { itemProps, isPressed } = createSelectableItem(
    {
      key: () => props.key,
      selectionManager: manager,
      shouldSelectOnPressUp: context.shouldSelectOnPressUp,
      allowsDifferentPressOrigin: context.shouldSelectOnPressUp,
      isVirtualized: context.isVirtualized,
      shouldUseVirtualFocus: context.shouldUseVirtualFocus,
      isDisabled
    },
    ref
  );

  const { hoverProps } = createHover({
    isDisabled: () => isDisabled() || !context.shouldFocusOnHover(),
    onHoverStart: () => {
      if (!isKeyboardFocusVisible()) {
        manager().setFocused(true);
        manager().setFocusedKey(props.key);
      }
    }
  });

  const isNotSafariMacOS = !(isMac && isWebKit);

  const baseOptionProps: JSX.HTMLAttributes<any> = {
    role: "option",
    get id() {
      return getItemId(context.listboxId(), props.key);
    },
    get "aria-disabled"() {
      return isDisabled();
    },
    get "aria-selected"() {
      return manager().selectionMode() !== "none" ? isSelected() : undefined;
    },
    // Safari with VoiceOver on macOS misreads options with aria-labelledby or aria-label as simply "text".
    // We should not map slots to the label and description on Safari and instead just have VoiceOver read the textContent.
    // https://bugs.webkit.org/show_bug.cgi?id=209279
    get "aria-label"() {
      return isNotSafariMacOS ? props["aria-label"] : undefined;
    },
    get "aria-labelledby"() {
      return isNotSafariMacOS ? labelId() : undefined;
    },
    get "aria-describedby"() {
      return isNotSafariMacOS ? descriptionId() : undefined;
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

  const optionProps = combineProps(baseOptionProps, itemProps, hoverProps);

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

  return {
    isFocused,
    isSelected,
    isDisabled,
    isPressed,
    optionProps,
    labelProps,
    descriptionProps
  };
}
