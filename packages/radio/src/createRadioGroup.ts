import { getFocusableTreeWalker } from "@solid-aria/focus";
import { useLocale } from "@solid-aria/i18n";
import { createFocusWithin } from "@solid-aria/interactions";
import { AriaLabelProps, createLabel } from "@solid-aria/label";
import {
  AriaLabelingProps,
  AriaValidationProps,
  DOMElements,
  DOMProps,
  InputBase,
  LabelableProps,
  Orientation,
  Validation,
  ValueBase
} from "@solid-aria/types";
import { combineProps, createId, filterDOMProps } from "@solid-aria/utils";
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

import { createRadioGroupState, RadioGroupState } from "./createRadioGroupState";

interface RadioGroupContextValue {
  /**
   * State for the radio group, as returned by `createRadioGroupState`.
   */
  state: RadioGroupState;

  /**
   * The name of the RadioGroup, used when submitting an HTML form.
   */
  name: Accessor<string>;
}

const RadioGroupContext = createContext<RadioGroupContextValue>();

export interface AriaRadioGroupProps
  extends ValueBase<string>,
    InputBase,
    Validation,
    LabelableProps,
    DOMProps,
    AriaLabelingProps,
    AriaValidationProps {
  /**
   * The Radio(s) contained within the RadioGroup.
   */
  children?: JSX.Element;

  /**
   * The axis the Radio Button(s) should align with.
   * @default 'vertical'
   */
  orientation?: Orientation;

  /**
   * The name of the RadioGroup, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name_and_radio_buttons).
   */
  name?: string;
}

interface RadioGroupAria<
  GroupElementType extends DOMElements,
  LabelElementType extends DOMElements
> {
  /**
   * Provide the radio group state to descendant elements.
   */
  RadioGroupProvider: Component;

  /**
   * Props for the radio group wrapper element.
   */
  groupProps: Accessor<JSX.IntrinsicElements[GroupElementType]>;

  /**
   * Props for the radio group's visible label (if any).
   *  */
  labelProps: Accessor<JSX.IntrinsicElements[LabelElementType]>;

  /**
   * State for the radio group, as returned by `createRadioGroupState`.
   */
  state: RadioGroupState;
}

/**
 * Provides the behavior and accessibility implementation for a radio group component.
 * Radio groups allow users to select a single item from a list of mutually exclusive options.
 * @param props - Props for the radio group.
 */
export function createRadioGroup<
  GroupElementType extends DOMElements = "div",
  LabelElementType extends DOMElements = "span"
>(props: AriaRadioGroupProps): RadioGroupAria<GroupElementType, LabelElementType> {
  const state = createRadioGroupState(props);

  const defaultGroupName = createId();

  const defaultProps: AriaRadioGroupProps = {
    name: defaultGroupName,
    orientation: "vertical"
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const locale = useLocale();

  const defaultCreateLabelProps: AriaLabelProps = {
    // Radio group is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    isHTMLLabelElement: false
  };

  const createLabelProps = mergeProps(defaultCreateLabelProps, props);

  const { labelProps, fieldProps } = createLabel<LabelElementType>(createLabelProps);

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  // When the radio group loses focus, reset the focusable radio to null if
  // there is no selection. This allows tabbing into the group from either
  // direction to go to the first or last radio.
  const { focusWithinProps } = createFocusWithin({
    onFocusOut: () => {
      if (!state.selectedValue()) {
        state.setLastFocusedValue(undefined);
      }
    }
  });

  // In RTL mode and horizontal orientation, the `left` and `right` keyDown is reversed.
  const onKeyDown = (event: KeyboardEvent) => {
    const isRTLMode = locale().direction === "rtl";
    const isHorizontal = props.orientation !== "vertical";

    let nextDir: "prev" | "next";

    switch (event.key) {
      case "ArrowRight":
        nextDir = isRTLMode && isHorizontal ? "prev" : "next";
        break;
      case "ArrowLeft":
        nextDir = isRTLMode && isHorizontal ? "next" : "prev";
        break;
      case "ArrowDown":
        nextDir = "next";
        break;
      case "ArrowUp":
        nextDir = "prev";
        break;
      default:
        return;
    }

    event.preventDefault();

    const target = event.target as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;

    const walker = getFocusableTreeWalker(currentTarget, {
      from: target
    });

    let nextElem;

    if (nextDir === "next") {
      nextElem = walker.nextNode();

      if (!nextElem) {
        walker.currentNode = currentTarget;
        nextElem = walker.firstChild();
      }
    } else {
      nextElem = walker.previousNode();

      if (!nextElem) {
        walker.currentNode = currentTarget;
        nextElem = walker.lastChild();
      }
    }

    if (nextElem) {
      // We assume radio group childs is an HTMLElement with a value attribute.
      const element = nextElem as HTMLElement & { value: string };

      // Call focus on nextElem so that keyboard navigation scrolls the radio into view.
      element.focus();

      state.setSelectedValue(element.value);
    }
  };

  const groupProps = createMemo(() => {
    return combineProps(domProps(), {
      role: "radiogroup",
      "aria-invalid": props.validationState === "invalid" || undefined,
      "aria-errormessage": props["aria-errormessage"],
      "aria-readonly": props.isReadOnly || undefined,
      "aria-required": props.isRequired || undefined,
      "aria-disabled": props.isDisabled || undefined,
      "aria-orientation": props.orientation,
      onKeyDown,
      ...fieldProps(),
      ...focusWithinProps()
    });
  });

  const name = createMemo(() => props.name ?? defaultGroupName);

  const RadioGroupProvider: Component = props => {
    return createComponent(RadioGroupContext.Provider, {
      value: { state, name },
      get children() {
        return props.children;
      }
    });
  };

  return { RadioGroupProvider, groupProps, labelProps, state };
}

export function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("[solid-aria]: useRadioGroupContext should be used in a RadioGroupProvider.");
  }

  return context;
}
