import { Accessor, mergeProps } from "solid-js";

import { AriaCheckboxProps, CheckboxAria, createCheckbox } from "./createCheckbox";
import { useCheckboxGroupContext } from "./createCheckboxGroup";
import { CheckboxGroupState } from "./createCheckboxGroupState";

export interface AriaCheckboxGroupItemProps
  extends Omit<AriaCheckboxProps, "isSelected" | "defaultSelected"> {
  value: string;
}

export interface CheckboxGroupItemAria extends Omit<CheckboxAria, "state"> {
  /**
   * State for the checkbox group, as returned by `createCheckboxGroupState`.
   */
  state: CheckboxGroupState;
}

/**
 * Provides the behavior and accessibility implementation for a checkbox component contained within a checkbox group.
 * Checkbox groups allow users to select multiple items from a list of options.
 * @param props - Props for the checkbox.
 * @param inputRef - A ref for the HTML input element.
 */
export function createCheckboxGroupItem(
  props: AriaCheckboxGroupItemProps,
  inputRef: Accessor<HTMLInputElement | undefined>
): CheckboxGroupItemAria {
  const context = useCheckboxGroupContext();

  const onChange = (isSelected: boolean) => {
    if (props.isDisabled || context.state.isDisabled()) {
      return;
    }

    isSelected ? context.state.addValue(props.value) : context.state.removeValue(props.value);

    props.onChange?.(isSelected);
  };

  const createCheckboxProps = mergeProps(props, {
    get isReadOnly() {
      return props.isReadOnly || context.state.isReadOnly();
    },
    get isSelected() {
      return context.state.isSelected(props.value);
    },
    get isDisabled() {
      return props.isDisabled || context.state.isDisabled();
    },
    get name() {
      return props.name || context.name();
    },
    onChange
  });

  const { inputProps } = createCheckbox(createCheckboxProps, inputRef);

  return { inputProps, state: context.state };
}
