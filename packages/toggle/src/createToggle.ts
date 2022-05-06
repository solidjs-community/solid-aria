import { createFocusable } from "@solid-aria/focus";
import { createPress } from "@solid-aria/interactions";
import {
  AriaLabelingProps,
  AriaValidationProps,
  FocusableDOMProps,
  FocusableProps,
  InputBase,
  Validation
} from "@solid-aria/types";
import { combineProps, filterDOMProps } from "@solid-aria/utils";
import { Accessor, createMemo, JSX, mergeProps, splitProps } from "solid-js";

import { createToggleState, ToggleState } from "./createToggleState";

export interface AriaToggleProps
  extends InputBase,
    Validation,
    FocusableProps,
    FocusableDOMProps,
    AriaLabelingProps,
    AriaValidationProps {
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   */
  "aria-controls"?: string;

  /**
   * The label for the element.
   */
  children?: JSX.Element;

  /**
   * Whether the element should be selected (uncontrolled).
   */
  defaultSelected?: boolean;

  /**
   * Whether the element should be selected (controlled).
   */
  isSelected?: boolean;

  /**
   * The value of the input element, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
   */
  value?: string;

  /**
   * The name of the input element, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string;

  /**
   * Handler that is called when the element's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;
}

export interface ToggleAria {
  /**
   * Props to be spread on the input element.
   */
  inputProps: Accessor<JSX.InputHTMLAttributes<HTMLInputElement>>;

  /**
   * State for the toggle element, as returned by `createToggleState`.
   */
  state: ToggleState;
}

/**
 * Handles interactions for toggle elements, e.g. Checkboxes and Switches.
 * @param props - Props for the toggle element.
 * @param inputRef - Ref to the HTML input element.
 */
export function createToggle(
  props: AriaToggleProps,
  inputRef: Accessor<HTMLInputElement | undefined>
): ToggleAria {
  const state = createToggleState(props);

  const defaultProps: AriaToggleProps = {
    isDisabled: false,
    validationState: "valid"
  };

  const propsWithDefault = mergeProps(defaultProps, props);
  const [local] = splitProps(propsWithDefault, [
    "isDisabled",
    "isRequired",
    "isReadOnly",
    "value",
    "name",
    "aria-errormessage",
    "aria-controls",
    "validationState"
  ]);

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = event => {
    // since we spread props on label, onChange will end up there as well as in here.
    // so we have to stop propagation at the lowest level that we care about
    event.stopPropagation();

    const target = event.target as HTMLInputElement;

    state.setSelected(target.checked);

    // Unlike in React, inputs `checked` state can be out of sync with our toggle state.
    // for example a readonly `<input type="checkbox" />` is always "checkable".
    //
    // Also even if an input is controlled (ex: `<input type="checkbox" checked={isChecked} />`,
    // clicking on the input will change its internal `checked` state.
    //
    // To prevent this, we need to force the input `checked` state to be in sync with the toggle state.
    target.checked = state.isSelected();
  };

  // This handles focusing the input on pointer down, which Safari does not do by default.
  const { pressProps } = createPress<HTMLInputElement>({
    isDisabled: () => props.isDisabled
  });

  const { focusableProps } = createFocusable(props, inputRef);
  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  const inputProps = createMemo(() => {
    return combineProps(
      domProps(),
      {
        "aria-invalid": local.validationState === "invalid" || undefined,
        "aria-errormessage": local["aria-errormessage"],
        "aria-controls": local["aria-controls"],
        "aria-readonly": local.isReadOnly || undefined,
        "aria-required": local.isRequired || undefined,
        disabled: local.isDisabled,
        value: local.value,
        name: local.name,
        type: "checkbox",
        onChange
      },
      pressProps(),
      focusableProps()
    );
  });

  return { inputProps, state };
}
