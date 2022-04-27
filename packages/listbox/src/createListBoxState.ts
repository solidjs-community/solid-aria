import { Key, SelectionBehavior, SelectionMode } from "@solid-aria/types";

import { ListBoxOptionMetaData } from "./types";

export interface CreateListBoxStateProps {
  /**
   * The type of selection that is allowed in the listbox.
   */
  selectionMode?: SelectionMode;

  /**
   * The selection behavior for the listbox.
   */
  selectionBehavior?: SelectionBehavior;
}

export interface ListBoxState {
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
  const options = new Map<Key, ListBoxOptionMetaData>();

  const registerOption = (metaData: ListBoxOptionMetaData) => {
    options.set(metaData.key, metaData);
  };

  const unregisterOption = (key: Key) => {
    options.delete(key);
  };

  return {
    registerOption,
    unregisterOption
  };
}
