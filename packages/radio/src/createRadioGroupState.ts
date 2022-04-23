import { createControllableSignal } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createSignal } from "solid-js";

export interface CreateRadioGroupStateProps {
  /**
   * The current selected value (controlled).
   */
  value?: MaybeAccessor<string | undefined>;

  /**
   * The default selected value (uncontrolled).
   */
  defaultValue?: MaybeAccessor<string | undefined>;

  /**
   * Whether the radio group is disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the radio group is read only.
   */
  isReadOnly?: MaybeAccessor<boolean | undefined>;

  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: string) => void;
}

export interface RadioGroupState {
  /**
   * Whether the radio group is disabled.
   */
  readonly isDisabled: Accessor<boolean>;

  /**
   * Whether the radio group is read only.
   */
  readonly isReadOnly: Accessor<boolean>;

  /**
   * The currently selected value.
   */
  readonly selectedValue: Accessor<string | undefined>;

  /**
   * The value of the last focused radio.
   */
  readonly lastFocusedValue: Accessor<string | undefined>;

  /**
   * Returns whether the given value is selected.
   */
  isSelected(value: string): boolean;

  /**
   * Sets the selected value.
   */
  setSelectedValue(value: string): void;

  /**
   * Sets the last focused value.
   */
  setLastFocusedValue(value: string | undefined): void;
}

/**
 * Provides state management for a radio group component.
 * Provides a name for the group, and manages selection and focus state.
 */
export function createRadioGroupState(props: CreateRadioGroupStateProps): RadioGroupState {
  const [selectedValue, setSelected] = createControllableSignal({
    value: () => access(props.value),
    defaultValue: () => access(props.defaultValue),
    onChange: props.onChange
  });

  const [lastFocusedValue, setLastFocusedValue] = createSignal(undefined);

  const isDisabled = () => {
    return access(props.isDisabled) || false;
  };

  const isReadOnly = () => {
    return access(props.isReadOnly) || false;
  };

  const isSelected = (value: string) => {
    return selectedValue() === value;
  };

  const setSelectedValue = (value: string) => {
    if (isReadOnly() || isDisabled()) {
      return;
    }

    setSelected(value);
  };

  return {
    selectedValue,
    setSelectedValue,
    lastFocusedValue,
    setLastFocusedValue,
    isDisabled,
    isReadOnly,
    isSelected
  };
}
