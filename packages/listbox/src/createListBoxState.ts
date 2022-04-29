import { createCollection, Item } from "@solid-aria/collection";
import {
  createListFocusManager,
  CreateListFocusManagerProps,
  createSelectionManager,
  CreateSelectionManagerProps,
  ListFocusManager,
  SelectionManager,
  SelectionMode
} from "@solid-aria/selection";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createEffect, on } from "solid-js";

type CreateListBoxStateOptions = Partial<
  Pick<
    CreateListFocusManagerProps<string> & CreateSelectionManagerProps<string>,
    | "selectedKeys"
    | "defaultSelectedKeys"
    | "allowEmptySelection"
    | "shouldFocusWrap"
    | "onSelectionChange"
  >
>;

export interface CreateListBoxStateProps extends CreateListBoxStateOptions {
  /**
   * The type of selection that is allowed in the listbox.
   * @default "single"
   */
  selectionMode?: MaybeAccessor<SelectionMode | undefined>;

  /**
   * Whether typeahead is enabled.
   * @default true
   */
  allowTypeAhead?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether selection should occur automatically on focus.
   * @default false
   */
  selectOnFocus?: MaybeAccessor<boolean | undefined>;
}

export interface ListBoxState {
  /**
   * An interface for managing the listbox selection state.
   */
  selectionManager: SelectionManager;

  /**
   * An interface for managing item's focus in the listbox.
   */
  focusManager: ListFocusManager;

  /**
   * Whether selection should occur automatically on focus.
   */
  selectOnFocus: Accessor<boolean>;

  /**
   * Register an option to the listbox with some meta data.
   */
  registerOption: (metaData: Item<string>) => void;

  /**
   * Unregister an option from the listbox.
   */
  unregisterOption: (key: string) => void;
}

/**
 * Provides state management for a listbox component.
 */
export function createListBoxState(props: CreateListBoxStateProps): ListBoxState {
  const collection = createCollection<Item<string>>();

  const selectionManager = createSelectionManager({
    collection,
    selectionMode: () => access(props.selectionMode) ?? "single",
    allowEmptySelection: () => access(props.allowEmptySelection) ?? true,
    selectedKeys: () => access(props.selectedKeys),
    defaultSelectedKeys: () => access(props.defaultSelectedKeys),
    onSelectionChange: keys => props.onSelectionChange?.(keys)
  });

  const focusManager = createListFocusManager({
    collection,
    selectionManager,
    shouldFocusWrap: () => access(props.shouldFocusWrap) ?? false
  });

  const selectOnFocus = () => access(props.selectOnFocus) ?? false;

  createEffect(
    on(
      () => focusManager.focusedKey(),
      newValue => {
        if (newValue != null && selectOnFocus()) {
          selectionManager.replaceSelection(newValue);
        }
      }
    )
  );

  return {
    selectionManager,
    focusManager,
    selectOnFocus,
    registerOption: collection.addItem,
    unregisterOption: collection.removeItem
  };
}
