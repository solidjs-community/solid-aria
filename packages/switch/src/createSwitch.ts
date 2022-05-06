import { AriaToggleProps, createToggle, ToggleState } from "@solid-aria/toggle";
import { AriaValidationProps, Validation } from "@solid-aria/types";
import { Accessor, createMemo, JSX } from "solid-js";

export type AriaSwitchProps = Omit<AriaToggleProps, keyof (Validation & AriaValidationProps)>;

export interface SwitchAria {
  /**
   * Props for the input element.
   */
  inputProps: Accessor<JSX.InputHTMLAttributes<HTMLInputElement>>;

  /**
   * State for the switch, as returned by `createToggleState`.
   */
  state: ToggleState;
}

/**
 * Provides the behavior and accessibility implementation for a switch component.
 * A switch is similar to a checkbox, but represents on/off values as opposed to selection.
 * @param props - Props for the switch.
 * @param inputRef - Ref to the HTML input element.
 */
export function createSwitch(
  props: AriaSwitchProps,
  inputRef: Accessor<HTMLInputElement | undefined>
): SwitchAria {
  const { inputProps: toggleInputProps, state } = createToggle(props, inputRef);

  const inputProps: Accessor<JSX.InputHTMLAttributes<HTMLInputElement>> = createMemo(() => ({
    ...toggleInputProps(),
    role: "switch",
    checked: state.isSelected(),
    "aria-checked": state.isSelected()
  }));

  return { inputProps, state };
}
