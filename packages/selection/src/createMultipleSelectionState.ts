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

import {
  DisabledBehavior,
  FocusStrategy,
  ItemKey,
  MultipleSelection,
  SelectionBehavior,
  SelectionType
} from "@solid-aria/types";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { createEffect, createMemo, createSignal, mergeProps, on } from "solid-js";

import { createControllableSelectionSignal } from "./createControllableSelectionSignal";
import { Selection } from "./Selection";
import { MultipleSelectionState } from "./types";

export interface MultipleSelectionStateProps extends MultipleSelection {
  /**
   * How multiple selection should behave in the collection.
   */
  selectionBehavior?: MaybeAccessor<SelectionBehavior | undefined>;

  /**
   * Whether onSelectionChange should fire even if the new set of keys is the same as the last.
   */
  allowDuplicateSelectionEvents?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether `disabledKeys` applies to all interactions, or only selection.
   */
  disabledBehavior?: MaybeAccessor<DisabledBehavior | undefined>;
}

/**
 * Manages state for multiple selection and focus in a collection.
 */
export function createMultipleSelectionState(
  props: MultipleSelectionStateProps
): MultipleSelectionState {
  const defaultProps: MultipleSelectionStateProps = {
    selectionMode: "none",
    selectionBehavior: "toggle",
    disabledBehavior: "all"
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const [isFocused, setFocused] = createSignal(false);
  const [focusedKey, _setFocusedKey] = createSignal<ItemKey>();
  const [childFocusStrategy, setChildFocusStrategy] = createSignal<FocusStrategy>("first");

  const selectedKeysProp = createMemo(() => {
    const selection = access(props.selectedKeys);

    if (!selection) {
      return;
    }

    return convertSelection(selection);
  });

  const defaultSelectedKeys = createMemo(() => {
    const defaultSelection = access(props.defaultSelectedKeys);

    if (!defaultSelection) {
      return new Selection();
    }

    return convertSelection(defaultSelection);
  });

  const [selectedKeys, _setSelectedKeys] = createControllableSelectionSignal({
    value: selectedKeysProp,
    defaultValue: defaultSelectedKeys,
    // eslint-disable-next-line solid/reactivity
    onChange: value => props.onSelectionChange?.(value)
  });

  const disabledKeysProp = createMemo(() => {
    const disabledKeys = access(props.disabledKeys);
    return disabledKeys ? new Set(disabledKeys) : new Set<ItemKey>();
  });

  const [selectionBehavior, setSelectionBehavior] = createSignal<SelectionBehavior>(
    // eslint-disable-next-line solid/reactivity
    access(props.selectionBehavior) ?? "toggle"
  );

  const selectionMode = () => access(props.selectionMode) ?? "none";
  const disallowEmptySelection = () => access(props.disallowEmptySelection) ?? false;
  const disabledBehavior = () => access(props.disabledBehavior) ?? "all";

  const setFocusedKey = (key?: ItemKey, childFocusStrategy: FocusStrategy = "first") => {
    setChildFocusStrategy(childFocusStrategy);
    _setFocusedKey(key);
  };

  const setSelectedKeys = (keys: SelectionType) => {
    if (access(props.allowDuplicateSelectionEvents) || !isSameSelection(keys, selectedKeys())) {
      _setSelectedKeys(keys);
    }
  };

  // If the selectionBehavior prop is set to replace, but the current state is toggle (e.g. due to long press
  // to enter selection mode on touch), and the selection becomes empty, reset the selection behavior.
  createEffect(() => {
    const selection = selectedKeys();
    if (
      access(props.selectionBehavior) === "replace" &&
      selectionBehavior() === "toggle" &&
      typeof selection === "object" &&
      selection.size === 0
    ) {
      setSelectionBehavior("replace");
    }
  });

  // If the selectionBehavior prop changes, update the state as well.
  createEffect(
    on(
      () => access(props.selectionBehavior),
      newValue => setSelectionBehavior(newValue ?? "toggle")
    )
  );

  return {
    selectionMode,
    disallowEmptySelection,
    disabledBehavior,
    selectionBehavior,
    setSelectionBehavior,
    isFocused,
    setFocused,
    focusedKey,
    childFocusStrategy,
    setFocusedKey,
    selectedKeys,
    setSelectedKeys,
    disabledKeys: disabledKeysProp
  };
}

function convertSelection(selection: "all" | Iterable<ItemKey>): "all" | Selection {
  return selection === "all" ? "all" : new Selection(selection);
}

function equalSets(setA: Set<any>, setB: Set<any>) {
  if (setA.size !== setB.size) {
    return false;
  }

  for (const item of setA) {
    if (!setB.has(item)) {
      return false;
    }
  }

  return true;
}

function isSameSelection(a: SelectionType, b: SelectionType): boolean {
  if (a === "all" && b === "all") {
    return true;
  }

  const isASet = typeof a === "object";
  const isBSet = typeof b === "object";

  if (isASet && isBSet && equalSets(a, b)) {
    return true;
  }

  return false;
}
