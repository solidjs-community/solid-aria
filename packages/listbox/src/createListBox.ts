import { createKeyboard } from "@solid-aria/interactions";
import { AriaLabelProps, createLabel } from "@solid-aria/label";
import {
  AriaLabelingProps,
  DOMElements,
  DOMProps,
  LabelableProps,
  SelectionMode
} from "@solid-aria/types";
import { combineProps, filterDOMProps } from "@solid-aria/utils";
import { Accessor, createMemo, JSX, mergeProps } from "solid-js";

import { ListBoxState } from "./createListBoxState";

export interface AriaListBoxProps extends LabelableProps, DOMProps, AriaLabelingProps {
  /**
   * The rendered contents of the listbox.
   */
  children?: JSX.Element;

  /**
   * The type of selection that is allowed in the collection.
   */
  selectionMode?: SelectionMode;

  /**
   * Whether the listbox allows empty selection.
   */
  allowEmptySelection?: boolean;

  /**
   * Whether the listbox is disabled.
   */
  isDisabled?: boolean;
}

export interface ListBoxAria<
  ListBoxElementType extends DOMElements,
  LabelElementType extends DOMElements
> {
  /**
   * Props for the listbox element.
   */
  listBoxProps: Accessor<JSX.IntrinsicElements[ListBoxElementType]>;

  /**
   * Props for the listbox's visual label element (if any).
   */
  labelProps: Accessor<JSX.IntrinsicElements[LabelElementType]>;
}

/**
 * Provides the behavior and accessibility implementation for a listbox component.
 * A listbox displays a list of options and allows a user to select one or more of them.
 * @param props - Props for the listbox.
 * @param state - State for the listbox, as returned by `createListBoxState`.
 */
export function createListBox<
  ListBoxElementType extends DOMElements = "ul",
  LabelElementType extends DOMElements = "span"
>(props: AriaListBoxProps, state: ListBoxState): ListBoxAria<ListBoxElementType, LabelElementType> {
  const defaultCreateLabelProps: AriaLabelProps = {
    // listbox is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    labelElementType: "span"
  };

  const createLabelProps = mergeProps(defaultCreateLabelProps, props);

  const { labelProps, fieldProps } = createLabel<LabelElementType>(createLabelProps);

  const { keyboardProps } = createKeyboard({
    isDisabled: () => props.isDisabled
  });

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  const listBoxProps: Accessor<JSX.IntrinsicElements[ListBoxElementType]> = createMemo(() => {
    return combineProps(domProps(), keyboardProps(), fieldProps(), {
      role: "listbox",
      "aria-multiselectable": props.selectionMode === "multiple" ? true : undefined,
      "aria-activedescendant": state.activeDescendant(),
      tabIndex: 0
    });
  });

  return { listBoxProps, labelProps };
}
