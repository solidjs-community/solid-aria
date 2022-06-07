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

import { focusSafely } from "@solid-aria/focus";
import { createLongPress, createPress, CreatePressProps } from "@solid-aria/interactions";
import { ItemKey, LongPressEvent, PointerType, PressEvent } from "@solid-aria/types";
import { combineProps } from "@solid-primitives/props";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createEffect, createMemo, JSX } from "solid-js";

import { MultipleSelectionManager } from "./types";
import { isCtrlKeyPressed, isNonContiguousSelectionModifier } from "./utils";

export interface CreateSelectableItemProps {
  /**
   * An interface for reading and updating multiple selection state.
   */
  selectionManager: MaybeAccessor<MultipleSelectionManager>;

  /**
   * A unique key for the item.
   */
  key: MaybeAccessor<ItemKey>;

  /**
   * By default, selection occurs on pointer down. This can be strange if selecting an
   * item causes the UI to disappear immediately (e.g. menus).
   */
  shouldSelectOnPressUp?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether selection requires the pointer/mouse down and up events to occur on the same target or triggers selection on
   * the target of the pointer/mouse up event.
   */
  allowsDifferentPressOrigin?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the option is contained in a virtual scroller.
   */
  isVirtualized?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the option should use virtual focus instead of being focused directly.
   */
  shouldUseVirtualFocus?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the item is disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /**
   * Function to focus the item.
   */
  focus?: () => void;

  /**
   * Handler that is called when a user performs an action on the item. The exact user event depends on
   * the collection's `selectionBehavior` prop and the interaction modality.
   */
  onAction?: () => void;
}

export interface SelectableItemStates {
  /**
   * Whether the item is currently in a pressed state.
   */
  isPressed: Accessor<boolean>;

  /**
   * Whether the item is currently selected.
   */
  isSelected: Accessor<boolean>;

  /**
   * Whether the item is non-interactive, i.e. both selection and actions are disabled and the item may
   * not be focused. Dependent on `disabledKeys` and `disabledBehavior`.
   */
  isDisabled: Accessor<boolean>;

  /**
   * Whether the item may be selected, dependent on `selectionMode`, `disabledKeys`, and `disabledBehavior`.
   */
  allowsSelection: Accessor<boolean>;

  /**
   * Whether the item has an action, dependent on `onAction`, `disabledKeys`,
   * and `disabledBehavior. It may also change depending on the current selection state
   * of the list (e.g. when selection is primary). This can be used to enable or disable hover
   * styles or other visual indications of interactivity.
   */
  hasAction: Accessor<boolean>;
}

export interface SelectableItemAria<T extends HTMLElement> extends SelectableItemStates {
  /**
   * Props to be spread on the item root node.
   */
  itemProps: Accessor<JSX.HTMLAttributes<T>>;
}

/**
 * Handles interactions with an item in a selectable collection.
 * @param props Props for the item.
 * @param ref Ref to the item.
 */
export function createSelectableItem<T extends HTMLElement>(
  props: CreateSelectableItemProps,
  ref: Accessor<T | undefined>
): SelectableItemAria<T> {
  const onSelect = (e: PressEvent | LongPressEvent | PointerEvent) => {
    const manager = access(props.selectionManager);
    const key = access(props.key);

    if (e.pointerType === "keyboard" && isNonContiguousSelectionModifier(e)) {
      manager.toggleSelection(key);
    } else {
      if (manager.selectionMode() === "none") {
        return;
      }

      if (manager.selectionMode() === "single") {
        if (manager.isSelected(key) && !manager.disallowEmptySelection()) {
          manager.toggleSelection(key);
        } else {
          manager.replaceSelection(key);
        }
      } else if (e && e.shiftKey) {
        manager.extendSelection(key);
      } else if (
        manager.selectionBehavior() === "toggle" ||
        (e && (isCtrlKeyPressed(e) || e.pointerType === "touch" || e.pointerType === "virtual"))
      ) {
        // if touch or virtual (VO) then we just want to toggle, otherwise it's impossible to multi select because they don't have modifier keys
        manager.toggleSelection(key);
      } else {
        manager.replaceSelection(key);
      }
    }
  };

  const isSelected = createMemo(() => {
    const manager = access(props.selectionManager);
    const key = access(props.key);

    return manager.isSelected(key);
  });

  // With checkbox selection, onAction (i.e. navigation) becomes primary, and occurs on a single click of the row.
  // Clicking the checkbox enters selection mode, after which clicking anywhere on any row toggles selection for that row.
  // With highlight selection, onAction is secondary, and occurs on double click. Single click selects the row.
  // With touch, onAction occurs on single tap, and long press enters selection mode.
  const isDisabled = createMemo(() => {
    const manager = access(props.selectionManager);
    const key = access(props.key);

    return access(props.isDisabled) || manager.isDisabled(key);
  });

  const allowsSelection = createMemo(() => {
    const manager = access(props.selectionManager);
    const key = access(props.key);

    return !isDisabled() && manager.canSelectItem(key);
  });

  const allowsActions = createMemo(() => props.onAction != null && !isDisabled());

  const hasPrimaryAction = createMemo(() => {
    const manager = access(props.selectionManager);

    return (
      allowsActions() &&
      (manager.selectionBehavior() === "replace" ? !allowsSelection() : manager.isEmpty())
    );
  });

  const hasSecondaryAction = createMemo(() => {
    const manager = access(props.selectionManager);

    return allowsActions() && allowsSelection() && manager.selectionBehavior() === "replace";
  });

  const hasAction = createMemo(() => hasPrimaryAction() || hasSecondaryAction());

  let modality: PointerType | null = null;

  const longPressEnabled = createMemo(() => hasAction() && allowsSelection());

  let longPressEnabledOnPressStart = false;
  let hadPrimaryActionOnPressStart = false;

  // By default, selection occurs on pointer down. This can be strange if selecting an
  // item causes the UI to disappear immediately (e.g. menus).
  // If shouldSelectOnPressUp is true, we use onPressUp instead of onPressStart.
  // onPress requires a pointer down event on the same element as pointer up. For menus,
  // we want to be able to have the pointer down on the trigger that opens the menu and
  // the pointer up on the menu item rather than requiring a separate press.
  // For keyboard events, selection still occurs on key down.
  const itemPressProps: Accessor<CreatePressProps> = createMemo(() => {
    const itemPressProps: CreatePressProps = {};

    if (access(props.shouldSelectOnPressUp)) {
      itemPressProps.onPressStart = e => {
        modality = e.pointerType;
        longPressEnabledOnPressStart = longPressEnabled();

        if (e.pointerType === "keyboard" && (!hasAction() || isSelectionKey())) {
          onSelect(e);
        }
      };

      // If allowsDifferentPressOrigin, make selection happen on pressUp (e.g. open menu on press down, selection on menu item happens on press up.)
      // Otherwise, have selection happen onPress (prevents listview row selection when clicking on interactable elements in the row)
      if (!access(props.allowsDifferentPressOrigin)) {
        itemPressProps.onPress = e => {
          if (hasPrimaryAction() || (hasSecondaryAction() && e.pointerType !== "mouse")) {
            if (e.pointerType === "keyboard" && !isActionKey()) {
              return;
            }

            props.onAction?.();
          } else if (e.pointerType !== "keyboard") {
            onSelect(e);
          }
        };
      } else {
        itemPressProps.onPressUp = e => {
          if (e.pointerType !== "keyboard") {
            onSelect(e);
          }
        };

        if (hasPrimaryAction()) {
          itemPressProps.onPress = props.onAction;
        }
      }
    } else {
      itemPressProps.onPressStart = e => {
        modality = e.pointerType;
        longPressEnabledOnPressStart = longPressEnabled();
        hadPrimaryActionOnPressStart = hasPrimaryAction();

        // Select on mouse down unless there is a primary action which will occur on mouse up.
        // For keyboard, select on key down. If there is an action, the Space key selects on key down,
        // and the Enter key performs onAction on key up.
        if (
          (e.pointerType === "mouse" && !hasPrimaryAction()) ||
          (e.pointerType === "keyboard" && (!props.onAction || isSelectionKey()))
        ) {
          onSelect(e);
        }
      };

      itemPressProps.onPress = e => {
        // Selection occurs on touch up. Primary actions always occur on pointer up.
        // Both primary and secondary actions occur on Enter key up. The only exception
        // is secondary actions, which occur on double click with a mouse.
        if (
          e.pointerType === "touch" ||
          e.pointerType === "pen" ||
          e.pointerType === "virtual" ||
          (e.pointerType === "keyboard" && hasAction() && isActionKey()) ||
          (e.pointerType === "mouse" && hadPrimaryActionOnPressStart)
        ) {
          if (hasAction()) {
            props.onAction?.();
          } else {
            onSelect(e);
          }
        }
      };
    }

    return itemPressProps;
  });

  const { pressProps, isPressed } = createPress({
    onPressStart: e => itemPressProps().onPressStart?.(e),
    onPressUp: e => itemPressProps().onPressUp?.(e),
    onPress: e => itemPressProps().onPress?.(e),
    preventFocusOnPress: () => access(props.shouldUseVirtualFocus)
  });

  // Long pressing an item with touch when selectionBehavior = 'replace' switches the selection behavior
  // to 'toggle'. This changes the single tap behavior from performing an action (i.e. navigating) to
  // selecting, and may toggle the appearance of a UI affordance like checkboxes on each item.
  const { longPressProps } = createLongPress({
    isDisabled: () => !longPressEnabled(),
    onLongPress(e) {
      const manager = access(props.selectionManager);

      if (e.pointerType === "touch") {
        onSelect(e);
        manager.setSelectionBehavior("toggle");
      }
    }
  });

  // Double clicking with a mouse with selectionBehavior = 'replace' performs an action.
  const onDoubleClick = (e: Event) => {
    if (!hasSecondaryAction()) {
      return;
    }

    if (modality === "mouse") {
      e.stopPropagation();
      e.preventDefault();
      props.onAction?.();
    }
  };

  // Prevent native drag and drop on long press if we also select on long press.
  // Once the user is in selection mode, they can long press again to drag.
  const onDragStart = (e: Event) => {
    if (modality === "touch" && longPressEnabledOnPressStart) {
      e.preventDefault();
    }
  };

  const itemProps = createMemo(() => {
    const manager = access(props.selectionManager);
    const key = access(props.key);
    const shouldUseVirtualFocus = access(props.shouldUseVirtualFocus);
    const refEl = ref();

    let itemProps: JSX.HTMLAttributes<T> & { "data-key"?: ItemKey } = {};

    // Set tabIndex to 0 if the element is focused, or -1 otherwise so that only the last focused
    // item is tabbable.  If using virtual focus, don't set a tabIndex at all so that VoiceOver
    // on iOS 14 doesn't try to move real DOM focus to the item anyway.
    if (!shouldUseVirtualFocus) {
      itemProps = {
        tabIndex: key === manager.focusedKey() ? 0 : -1,
        onFocus(e) {
          if (refEl && e.target === refEl) {
            manager.setFocusedKey(key);
          }
        }
      };
    }

    if (!access(props.isVirtualized)) {
      itemProps["data-key"] = key;
    }

    return combineProps(
      itemProps,
      allowsSelection() || hasPrimaryAction() ? pressProps() : {},
      longPressEnabled() ? longPressProps() : {},
      { onDoubleClick, onDragStart }
    ) as JSX.HTMLAttributes<T>;
  });

  // Focus the associated DOM node when this item becomes the focusedKey
  createEffect(() => {
    const manager = access(props.selectionManager);
    const key = access(props.key);
    const shouldUseVirtualFocus = access(props.shouldUseVirtualFocus);
    const refEl = ref();

    const isFocused = key === manager.focusedKey();

    if (
      isFocused &&
      manager.isFocused() &&
      !shouldUseVirtualFocus &&
      refEl &&
      document.activeElement !== refEl
    ) {
      if (props.focus) {
        props.focus();
      } else {
        focusSafely(refEl);
      }
    }
  });

  return {
    itemProps,
    isPressed,
    isSelected,
    isDisabled,
    allowsSelection,
    hasAction
  };
}

function isActionKey() {
  const event = window.event as KeyboardEvent;
  return event?.key === "Enter";
}

function isSelectionKey() {
  const event = window.event as KeyboardEvent;
  return event?.key === " " || event?.code === "Space";
}
