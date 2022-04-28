import { Key, SelectionMode } from "@solid-aria/types";
import { Accessor, createSignal } from "solid-js";

import { ListBoxOptionMetaData } from "./types";

export interface CreateListBoxStateProps {
  /**
   * The type of selection that is allowed in the listbox.
   */
  selectionMode?: SelectionMode;

  /**
   * Whether the listbox allows empty selection.
   */
  allowEmptySelection?: boolean;
}

export interface ListBoxState {
  /**
   * The current aria-activedescendant in the listbox.
   */
  activeDescendant: Accessor<Key | undefined>;

  /**
   * Sets the aria-activedescendant in the listbox.
   */
  setActiveDescendant: (key: Key) => void;

  /**
   * Returns whether a key is selected.
   */
  isSelected(key: Key): boolean;

  /**
   * Replaces the selection with only the given key.
   */
  replaceSelection(key: Key): void;

  /**
   * Toggles whether the given key is selected.
   */
  toggleSelection(key: Key): void;

  /**
   * Toggles or replaces selection with the given key depending on the listbox's selection mode.
   */
  select(key: Key): void;

  /**
   * Selects all items in the collection.
   */
  selectAll(): void;

  /**
   * Removes all keys from the selection.
   */
  clearSelection(): void;

  /**
   * Register an option to the listbox.
   */
  registerOption: (metaData: ListBoxOptionMetaData) => void;

  /**
   * Unregister an option from the listbox.
   */
  unregisterOption: (key: Key) => void;
}

/**
 * Provides state management for a listbox component.
 */
export function createListBoxState(props: CreateListBoxStateProps): ListBoxState {
  const [options, setOptions] = createSignal<Array<ListBoxOptionMetaData>>([]);
  const [selectedKeys, setSelectedKeys] = createSignal<Set<Key>>(new Set([]));
  const [activeDescendant, setActiveDescendant] = createSignal<Key | undefined>();

  const isSelected = (key: Key) => {
    return selectedKeys().has(key);
  };

  const replaceSelection = (key: Key) => {
    setSelectedKeys(new Set([key]));
  };

  const toggleSelection = (key: Key) => {
    if (props.selectionMode === "single" && !isSelected(key)) {
      replaceSelection(key);
      return;
    }

    const keys = selectedKeys();

    isSelected(key) ? keys.delete(key) : keys.add(key);

    if (!props.allowEmptySelection && keys.size === 0) {
      return;
    }

    setSelectedKeys(keys);
  };

  const select = (key: Key) => {
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

  const registerOption = (metaData: ListBoxOptionMetaData) => {
    setOptions(prev => [...prev, metaData]);
  };

  const unregisterOption = (key: Key) => {
    setOptions(prev => prev.filter(option => option.key !== key));
  };

  return {
    activeDescendant,
    setActiveDescendant,
    isSelected,
    replaceSelection,
    toggleSelection,
    select,
    selectAll,
    clearSelection,
    registerOption,
    unregisterOption
  };
}
