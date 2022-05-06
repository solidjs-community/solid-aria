import { AriaToggleProps, createToggle, ToggleState } from "@solid-aria/toggle";
import { access } from "@solid-primitives/utils";
import { Accessor, createEffect, createMemo, JSX, on } from "solid-js";

export interface AriaCheckboxProps extends AriaToggleProps {
  /**
   * Indeterminism is presentational only.
   * The indeterminate visual representation remains regardless of user interaction.
   */
  isIndeterminate?: boolean;
}

export interface CheckboxAria {
  /**
   * Props for the input element.
   */
  inputProps: Accessor<JSX.InputHTMLAttributes<HTMLInputElement>>;

  /**
   * State for the checkbox, as returned by `createToggleState`.
   */
  state: ToggleState;
}

/**
 * Provides the behavior and accessibility implementation for a checkbox component.
 * Checkboxes allow users to select multiple items from a list of individual items,
 * or to mark one individual item as selected.
 * @param props - Props for the checkbox.
 * @param inputRef - A ref for the HTML input element.
 */
export function createCheckbox(
  props: AriaCheckboxProps,
  inputRef: Accessor<HTMLInputElement | undefined>
): CheckboxAria {
  const { inputProps: toggleInputProps, state } = createToggle(props, inputRef);

  // indeterminate is a property, but it can only be set via javascript
  // https://css-tricks.com/indeterminate-checkboxes/
  createEffect(() => {
    const input = access(inputRef);

    if (input) {
      input.indeterminate = props.isIndeterminate || false;
    }
  });

  // Unlike in React, inputs `indeterminate` state can be out of sync with our `props.isIndeterminate`.
  // Clicking on the input will change its internal `indeterminate` state.
  // To prevent this, we need to force the input `indeterminate` state to be in sync with our `props.isIndeterminate`.
  createEffect(
    on(
      () => state.isSelected(),
      () => {
        const input = access(inputRef);

        if (input) {
          input.indeterminate = props.isIndeterminate || false;
        }
      }
    )
  );

  const inputProps: Accessor<JSX.InputHTMLAttributes<HTMLInputElement>> = createMemo(() => ({
    ...toggleInputProps(),
    checked: state.isSelected(),
    "aria-checked": props.isIndeterminate ? "mixed" : state.isSelected()
  }));

  return { inputProps, state };
}
