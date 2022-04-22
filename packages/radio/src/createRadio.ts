import { createFocusable, CreateFocusableProps } from "@solid-aria/focus";
import { createPress } from "@solid-aria/interactions";
import { AriaLabelingProps, DOMProps, FocusableProps } from "@solid-aria/types";
import { combineProps, filterDOMProps } from "@solid-aria/utils";
import { Accessor, createMemo, JSX } from "solid-js";

import { RadioGroupState } from "./createRadioGroupState";
import { radioGroupNames } from "./utils";

export interface AriaRadioProps extends FocusableProps, DOMProps, AriaLabelingProps {
  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string;

  /**
   * Whether the radio button is disabled or not.
   * Shows that a selection exists, but is not available in that circumstance.
   */
  isDisabled?: boolean;

  /**
   * The label for the Radio. Accepts any renderable node.
   */
  children?: JSX.Element;
}

interface RadioAria {
  /**
   * Props for the input element.
   */
  inputProps: Accessor<JSX.InputHTMLAttributes<HTMLInputElement>>;
}

/**
 * Provides the behavior and accessibility implementation for an individual
 * radio button in a radio group.
 * @param props - Props for the radio.
 * @param state - State for the radio group, as returned by `useRadioGroupState`.
 * @param ref - Ref to the HTML input element.
 */
export function createRadio(
  props: AriaRadioProps,
  state: RadioGroupState,
  inputRef: Accessor<HTMLInputElement | undefined>
): RadioAria {
  const isDisabled = () => {
    return props.isDisabled || state.isDisabled();
  };

  const isChecked = () => {
    return state.selectedValue() === props.value;
  };

  const isLastFocused = () => {
    return state.lastFocusedValue() === props.value;
  };

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = event => {
    event.stopPropagation();
    state.setSelectedValue(props.value);
  };

  const { pressProps } = createPress(props);

  const createFocusableProps = combineProps(props, {
    onFocus: () => state.setLastFocusedValue(props.value)
  } as CreateFocusableProps);

  const { focusableProps } = createFocusable(createFocusableProps, inputRef);

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  const tabIndex = createMemo(() => {
    if (isDisabled()) {
      return undefined;
    }

    return isLastFocused() || state.lastFocusedValue() == null ? 0 : -1;
  });

  const inputProps: Accessor<JSX.InputHTMLAttributes<HTMLInputElement>> = createMemo(() => {
    return combineProps(domProps(), pressProps(), focusableProps(), {
      type: "radio",
      name: radioGroupNames.get(state),
      tabIndex: tabIndex(),
      disabled: isDisabled(),
      checked: isChecked(),
      value: props.value,
      onChange
    });
  });

  return { inputProps };
}
