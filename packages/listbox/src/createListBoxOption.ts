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
import { createSlotId, isMac, isWebKit } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, createMemo, JSX } from "solid-js";

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
   * Props for the option element.
   */
  optionProps: Accessor<JSX.HTMLAttributes<any>>;

  /**
   * Props for the main text element inside the option.
   */
  labelProps: Accessor<JSX.HTMLAttributes<any>>;

  /**
   * Props for the description text element inside the option, if any.
   */
  descriptionProps: Accessor<JSX.HTMLAttributes<any>>;

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

  const isDisabled = createMemo(() => context.state().disabledKeys().has(props.key));
  const isSelected = createMemo(() => context.state().selectionManager().isSelected(props.key));
  const isFocused = createMemo(() => context.state().selectionManager().focusedKey() === props.key);

  const { itemProps, isPressed } = createSelectableItem(
    {
      selectionManager: () => context.state().selectionManager(),
      key: () => props.key,
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
        const manager = context.state().selectionManager();

        manager.setFocused(true);
        manager.setFocusedKey(props.key);
      }
    }
  });

  const optionProps = createMemo(() => {
    const manager = context.state().selectionManager();

    const optionProps: JSX.HTMLAttributes<any> = {
      role: "option",
      id: getItemId(context.listboxId(), props.key),
      "aria-disabled": isDisabled(),
      "aria-selected": manager.selectionMode() !== "none" ? isSelected() : undefined
    };

    // Safari with VoiceOver on macOS misreads options with aria-labelledby or aria-label as simply "text".
    // We should not map slots to the label and description on Safari and instead just have VoiceOver read the textContent.
    // https://bugs.webkit.org/show_bug.cgi?id=209279
    if (!(isMac() && isWebKit())) {
      optionProps["aria-label"] = props["aria-label"];
      optionProps["aria-labelledby"] = labelId();
      optionProps["aria-describedby"] = descriptionId();
    }

    const collection = context.state().collection();
    const item = collection.getItem(props.key);

    if (context.isVirtualized()) {
      optionProps["aria-posinset"] = item ? item.index + 1 : undefined;
      optionProps["aria-setsize"] = getItemCount(collection);
    }

    return combineProps(optionProps, itemProps(), hoverProps()) as JSX.HTMLAttributes<any>;
  });

  const labelProps: Accessor<JSX.HTMLAttributes<any>> = createMemo(() => ({
    id: labelId()
  }));

  const descriptionProps: Accessor<JSX.HTMLAttributes<any>> = createMemo(() => ({
    id: descriptionId()
  }));

  return {
    optionProps,
    labelProps,
    descriptionProps,
    isFocused,
    isSelected,
    isDisabled,
    isPressed
  };
}
