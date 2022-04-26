import { AriaLabelProps, createLabel } from "@solid-aria/label";
import {
  AriaLabelingProps,
  DOMElements,
  DOMProps,
  LabelableProps,
  SelectionBehavior,
  SelectionMode
} from "@solid-aria/types";
import { combineProps, filterDOMProps } from "@solid-aria/utils";
import { Accessor, createMemo, JSX, mergeProps } from "solid-js";

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
   * The selection behavior for the collection.
   */
  selectionBehavior?: SelectionBehavior;
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
>(props: AriaListBoxProps): ListBoxAria<ListBoxElementType, LabelElementType> {
  const defaultCreateLabelProps: AriaLabelProps = {
    // listbox is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    labelElementType: "span"
  };

  const createLabelProps = mergeProps(defaultCreateLabelProps, props);

  const { labelProps, fieldProps } = createLabel<LabelElementType>(createLabelProps);

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  const listBoxProps: Accessor<JSX.IntrinsicElements[ListBoxElementType]> = createMemo(() => {
    return combineProps(domProps(), fieldProps(), {
      role: "listbox",
      "aria-multiselectable": props.selectionMode === "multiple" ? true : undefined
    });
  });

  return { listBoxProps, labelProps };
}
