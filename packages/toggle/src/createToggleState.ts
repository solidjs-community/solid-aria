import { createControllableBooleanSignal } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor } from "solid-js";

interface CreateToggleStateProps {
  /**
   * Whether the element should be selected (uncontrolled).
   */
  defaultSelected?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the element should be selected (controlled).
   */
  isSelected?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the element can be selected but not changed by the user.
   */
  isReadOnly?: MaybeAccessor<boolean | undefined>;

  /**
   * Handler that is called when the element's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;
}

export interface ToggleState {
  /**
   * Whether the toggle is selected.
   */
  isSelected: Accessor<boolean>;

  /**
   *  Updates selection state.
   */
  setSelected: (isSelected: boolean) => void;

  /**
   * Toggle the selection state.
   */
  toggle: () => void;
}

/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export function createToggleState(props: CreateToggleStateProps = {}): ToggleState {
  const [isSelected, _setSelected] = createControllableBooleanSignal({
    value: () => access(props.isSelected),
    defaultValue: () => !!access(props.defaultSelected),
    onChange: props.onChange
  });

  const setSelected = (value: boolean) => {
    if (!access(props.isReadOnly)) {
      _setSelected(value);
    }
  };

  const toggle = () => {
    if (!access(props.isReadOnly)) {
      _setSelected(!isSelected());
    }
  };

  return { isSelected, setSelected, toggle };
}
