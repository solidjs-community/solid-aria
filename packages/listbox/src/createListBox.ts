import { createFocusable } from "@solid-aria/focus";
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

interface AriaListBoxOptions extends LabelableProps, DOMProps, AriaLabelingProps {
  /**
   * The type of selection that is allowed in the listbox.
   */
  selectionMode?: SelectionMode;

  /**
   * Whether the listbox is disabled.
   */
  isDisabled?: boolean;

  /**
   * The rendered contents of the listbox.
   */
  children?: JSX.Element;
}

export interface AriaListBoxProps extends AriaListBoxOptions {
  /**
   * The currently selected keys in the listbox (controlled).
   */
  selectedKeys?: Set<string>;

  /**
   * The initial selected keys in the listbox (uncontrolled).
   */
  defaultSelectedKeys?: Set<string>;

  /**
   * Whether the listbox allows empty selection.
   */
  allowEmptySelection?: boolean;

  /**
   * Whether typeahead is enabled.
   */
  allowTypeAhead?: boolean;

  /**
   * Whether focus should wrap around when the end/start is reached.
   */
  shouldFocusWrap?: boolean;

  /**
   * Whether selection should occur automatically on focus.
   */
  selectOnFocus?: boolean;

  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (keys: Set<string>) => any;
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
  LabelElementType extends DOMElements = "div"
>(
  props: AriaListBoxOptions,
  state: ListBoxState
): ListBoxAria<ListBoxElementType, LabelElementType> {
  const defaultCreateLabelProps: AriaLabelProps = {
    // listbox is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    isHTMLLabelElement: false
  };

  const createLabelProps = mergeProps(defaultCreateLabelProps, props);

  const { labelProps, fieldProps } = createLabel<LabelElementType>(createLabelProps);

  const { focusableProps } = createFocusable({
    isDisabled: () => props.isDisabled,
    onFocus: () => {
      state.focusFirstSelected();
    },
    onKeyDown: event => {
      const { key } = event;

      switch (key) {
        case "Home":
          state.focusFirst();
          break;
        case "End":
          state.focusLast();
          break;
        case "ArrowUp":
          state.focusPrevious();
          break;
        case "ArrowDown":
          state.focusNext();
          break;
      }
    }
  });

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  const listBoxProps: Accessor<JSX.IntrinsicElements[ListBoxElementType]> = createMemo(() => {
    return combineProps(domProps(), focusableProps(), fieldProps(), {
      role: "listbox",
      "aria-multiselectable": props.selectionMode === "multiple" ? true : undefined,
      tabIndex: state.listBoxTabIndex()
    });
  });

  return { listBoxProps, labelProps };
}
