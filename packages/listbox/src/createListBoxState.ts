import { SelectionMode } from "@solid-aria/types";
import { createControllableSignal } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createEffect, createMemo, createSignal, mergeProps, on } from "solid-js";

import { ListBoxOptionMetaData } from "./types";

export interface CreateListBoxStateProps {
  /**
   * The currently selected keys in the listbox (controlled).
   */
  selectedKeys?: MaybeAccessor<Set<string> | undefined>;

  /**
   * The initial selected keys in the listbox (uncontrolled).
   */
  defaultSelectedKeys?: MaybeAccessor<Set<string> | undefined>;

  /**
   * The type of selection that is allowed in the listbox.
   * @default "single"
   */
  selectionMode?: MaybeAccessor<SelectionMode | undefined>;

  /**
   * Whether the listbox allows empty selection.
   * @default true
   */
  allowEmptySelection?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether typeahead is enabled.
   * @default true
   */
  allowTypeAhead?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether focus should wrap around when the end/start is reached.
   * @default false
   */
  shouldFocusWrap?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether selection should occur automatically on focus.
   * @default false
   */
  selectOnFocus?: MaybeAccessor<boolean | undefined>;

  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (keys: Set<string>) => any;
}

export interface ListBoxState {
  /**
   * tabIndex of the listbox element.
   */
  listBoxTabIndex: Accessor<number>;

  /**
   * Returns whether an option with the given key is focused.
   */
  isFocusedKey: (key: string) => boolean;

  /**
   * Returns whether a key is selected.
   */
  isSelected: (key: string) => boolean;

  /**
   * Replaces the selection with only the given key.
   */
  replaceSelection: (key: string) => void;

  /**
   * Toggles whether the given key is selected.
   */
  toggleSelection: (key: string) => void;

  /**
   * Toggles or replaces selection with the given key depending on the listbox's selection mode.
   */
  select: (key: string) => void;

  /**
   * Selects all items in the collection.
   */
  selectAll: () => void;

  /**
   * Removes all keys from the selection.
   */
  clearSelection: () => void;

  /**
   * Focus first option.
   */
  focusFirst: () => void;

  /**
   * Focus last option.
   */
  focusLast: () => void;

  /**
   * Focus previous option.
   */
  focusPrevious: () => void;

  /**
   * Focus next option.
   */
  focusNext: () => void;

  /**
   * Focus the first selected option.
   */
  focusFirstSelected: () => void;

  /**
   * Register an option to the listbox.
   */
  registerOption: (metaData: ListBoxOptionMetaData) => void;

  /**
   * Unregister an option from the listbox.
   */
  unregisterOption: (key: string) => void;
}

/**
 * Provides state management for a listbox component.
 */
export function createListBoxState(props: CreateListBoxStateProps): ListBoxState {
  const defaultProps: CreateListBoxStateProps = {
    selectionMode: "single",
    allowEmptySelection: true,
    allowTypeAhead: true
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const [selectedKeys, setSelectedKeys] = createControllableSignal<Set<string>>({
    value: () => access(props.selectedKeys),
    defaultValue: () => access(props.defaultSelectedKeys) ?? new Set([]),
    onChange: props.onSelectionChange
  });

  const [options, setOptions] = createSignal<Array<ListBoxOptionMetaData>>([]);
  const [focusedKey, setFocusedKey] = createSignal<string | undefined>();

  const listBoxTabIndex = createMemo(() => (focusedKey() == null ? 0 : -1));

  const findIndexForKey = (key?: string) => {
    if (key == null) {
      return -1;
    }

    return options().findIndex(option => option.key === key);
  };

  const isFocusedKey = (key: string) => {
    return key === focusedKey();
  };

  const isSelected = (key: string) => {
    return selectedKeys()?.has(key) ?? false;
  };

  const replaceSelection = (key: string) => {
    setSelectedKeys(new Set([key]));
  };

  const toggleSelection = (key: string) => {
    if (props.selectionMode === "single" && !isSelected(key)) {
      replaceSelection(key);
      return;
    }

    const keys = selectedKeys() ?? new Set([]);

    isSelected(key) ? keys.delete(key) : keys.add(key);

    if (!props.allowEmptySelection && keys.size === 0) {
      return;
    }

    setSelectedKeys(keys);
  };

  const select = (key: string) => {
    if (props.selectionMode === "single") {
      if (isSelected(key) && props.allowEmptySelection) {
        toggleSelection(key);
      } else {
        replaceSelection(key);
      }
    } else {
      toggleSelection(key);
    }
  };

  const selectAll = () => {
    if (props.selectionMode !== "multiple") {
      return;
    }

    setSelectedKeys(new Set(options().map(option => option.key)));
  };

  const clearSelection = () => {
    if (!props.allowEmptySelection) {
      return;
    }

    setSelectedKeys(new Set([]));
  };

  const focusAtIndex = (index: number) => {
    const option = options()[index];

    if (!option) {
      return;
    }

    setFocusedKey(option.key);

    option.ref.focus();
  };

  const focusFirst = () => {
    focusAtIndex(0);
  };

  const focusLast = () => {
    focusAtIndex(options().length - 1);
  };

  const focusPrevious = () => {
    const index = findIndexForKey(focusedKey());

    if (index === -1) {
      return;
    }

    const isFirstIndex = index === 0;

    if (isFirstIndex) {
      props.shouldFocusWrap && focusLast();
      return;
    }

    focusAtIndex(index - 1);
  };

  const focusNext = () => {
    const index = findIndexForKey(focusedKey());

    if (index === -1) {
      return;
    }

    const isLastIndex = index === options().length - 1;

    if (isLastIndex) {
      props.shouldFocusWrap && focusFirst();
      return;
    }

    focusAtIndex(index + 1);
  };

  const focusFirstSelected = () => {
    // A previously focused option exist, bring back focus to it.
    if (focusedKey() != null) {
      focusAtIndex(findIndexForKey(focusedKey()));
      return;
    }

    // No selection, focus the first option.
    if (!selectedKeys() || selectedKeys()?.size === 0) {
      focusFirst();
      return;
    }

    // Focus the first option in the listbox that is selected.
    const index = options().findIndex(option => selectedKeys()?.has(option.key));

    focusAtIndex(index);
  };

  const registerOption = (metaData: ListBoxOptionMetaData) => {
    setOptions(prev => [...prev, metaData]);
  };

  const unregisterOption = (key: string) => {
    setOptions(prev => prev.filter(option => option.key !== key));
  };

  createEffect(
    on(focusedKey, newValue => {
      if (newValue != null && props.selectOnFocus) {
        replaceSelection(newValue);
      }
    })
  );

  return {
    listBoxTabIndex,
    isFocusedKey,
    isSelected,
    replaceSelection,
    toggleSelection,
    select,
    selectAll,
    clearSelection,
    focusFirst,
    focusLast,
    focusPrevious,
    focusNext,
    focusFirstSelected,
    registerOption,
    unregisterOption
  };
}
