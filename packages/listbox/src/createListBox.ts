import { createFocusable } from "@solid-aria/focus";
import { AriaLabelProps, createLabel } from "@solid-aria/label";
import { createTypeSelect, isCtrlKeyPressed, SelectionMode } from "@solid-aria/selection";
import { AriaLabelingProps, DOMElements, DOMProps, LabelableProps } from "@solid-aria/types";
import { combineProps, filterDOMProps } from "@solid-aria/utils";
import {
  Accessor,
  Component,
  createComponent,
  createContext,
  createMemo,
  JSX,
  mergeProps,
  useContext
} from "solid-js";

import { createListBoxState, ListBoxState } from "./createListBoxState";

const ListBoxContext = createContext<ListBoxState>();

export interface AriaListBoxProps extends LabelableProps, DOMProps, AriaLabelingProps {
  /**
   * The currently selected keys in the listbox (controlled).
   */
  selectedKeys?: Set<string>;

  /**
   * The initial selected keys in the listbox (uncontrolled).
   */
  defaultSelectedKeys?: Set<string>;

  /**
   * The type of selection that is allowed in the listbox.
   */
  selectionMode?: SelectionMode;

  /**
   * Whether the listbox allows empty selection.
   */
  allowEmptySelection?: boolean;

  /**
   * Whether focus should wrap around when the end/start is reached.
   */
  shouldFocusWrap?: boolean;

  /**
   * Whether options should be focused when the user hovers over them.
   */
  shouldFocusOnHover?: boolean;

  /**
   * Whether selection should occur automatically on focus.
   */
  selectOnFocus?: boolean;

  /**
   * Whether the listbox should be automatically focused upon render.
   */
  autoFocus?: boolean;

  /**
   * Whether the listbox is disabled.
   */
  isDisabled?: boolean;

  /**
   * The rendered contents of the listbox.
   */
  children?: JSX.Element;

  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (keys: Set<string>) => void;
}

export interface ListBoxAria<
  ListBoxElementType extends DOMElements,
  LabelElementType extends DOMElements
> {
  /**
   * Provide the listbox state to descendant elements.
   */
  ListBoxProvider: Component;

  /**
   * State of the listbox.
   */
  state: ListBoxState;

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
 * @param ref - A ref for the HTML listbox element.
 * @param scrollRef - The ref attached to the scrollable body, if not provided the listbox ref will be used.
 */
export function createListBox<
  ListBoxElementType extends DOMElements = "ul",
  LabelElementType extends DOMElements = "div",
  RefElement extends HTMLElement = HTMLUListElement
>(
  props: AriaListBoxProps,
  ref: Accessor<RefElement | undefined>,
  scrollRef?: Accessor<HTMLElement | undefined>
): ListBoxAria<ListBoxElementType, LabelElementType> {
  const defaultCreateLabelProps: AriaLabelProps = {
    // listbox is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    isHTMLLabelElement: false
  };

  const scrollElementRef = createMemo(() => {
    if (scrollRef) {
      return scrollRef();
    }

    // Fallback to the listbox ref
    return ref();
  });

  const state = createListBoxState(props, scrollElementRef);

  const createLabelProps = mergeProps(defaultCreateLabelProps, props);

  const { labelProps, fieldProps } = createLabel<LabelElementType>(createLabelProps);

  const isMultipleSelectionMode = () => state.selectionManager.selectionMode() === "multiple";

  const { focusableProps } = createFocusable(
    {
      isDisabled: () => props.isDisabled,
      autoFocus: () => props.autoFocus,
      onFocus: () => {
        setTimeout(() => state.focusManager.focusFirstSelectedItem(), 0);
      },
      onKeyDown: event => {
        const { key } = event;

        switch (key) {
          case "Home":
            event.preventDefault();
            state.focusManager.focusFirstItem();
            break;
          case "End":
            event.preventDefault();
            state.focusManager.focusLastItem();
            break;
          case "ArrowUp":
            event.preventDefault();
            state.focusManager.focusItemAbove();
            break;
          case "ArrowDown":
            event.preventDefault();
            state.focusManager.focusItemBelow();
            break;
          case "PageUp":
            event.preventDefault();
            state.focusManager.focusItemPageAbove();
            break;
          case "PageDown":
            event.preventDefault();
            state.focusManager.focusItemPageBelow();
            break;
          case "a":
            if (isCtrlKeyPressed(event) && isMultipleSelectionMode()) {
              event.preventDefault();
              state.selectionManager.selectAll();
            }
            break;
        }
      }
    },
    ref
  );

  const { typeSelectProps } = createTypeSelect<ListBoxElementType>({
    focusManager: () => state.focusManager
  });

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  const listBoxProps = createMemo(() => {
    return combineProps(domProps(), focusableProps(), typeSelectProps(), fieldProps(), {
      role: "listbox",
      "aria-multiselectable": isMultipleSelectionMode() ? true : undefined,
      tabIndex: state.focusManager.focusedKey() == null ? 0 : -1
    }) as JSX.IntrinsicElements[ListBoxElementType];
  });

  const ListBoxProvider: Component = props => {
    return createComponent(ListBoxContext.Provider, {
      value: state,
      get children() {
        return props.children;
      }
    });
  };

  return { ListBoxProvider, state, listBoxProps, labelProps };
}

export function useListBoxContext() {
  const context = useContext(ListBoxContext);

  if (!context) {
    throw new Error("[solid-aria]: useListBoxContext should be used in a ListBoxProvider.");
  }

  return context;
}
