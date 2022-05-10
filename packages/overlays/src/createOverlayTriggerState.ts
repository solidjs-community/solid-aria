import { createControllableBooleanSignal } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor } from "solid-js";

export interface CreateOverlayTriggerStateProps {
  /**
   * Whether the overlay is open by default (controlled).
   */
  isOpen?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the overlay is open by default (uncontrolled).
   */
  defaultOpen?: MaybeAccessor<boolean | undefined>;

  /**
   * Handler that is called when the overlay's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
}

export interface OverlayTriggerState {
  /**
   * Whether the overlay is currently open.
   */
  readonly isOpen: Accessor<boolean>;

  /**
   * Sets whether the overlay is open.
   */
  setOpen: (isOpen: boolean) => void;

  /**
   * Opens the overlay.
   */
  open: () => void;

  /**
   * Closes the overlay.
   */
  close: () => void;

  /**
   * Toggles the overlay's visibility.
   */
  toggle: () => void;
}

/**
 * Manages state for an overlay trigger. Tracks whether the overlay is open, and provides
 * methods to toggle this state.
 */
export function createOverlayTriggerState(
  props: CreateOverlayTriggerStateProps
): OverlayTriggerState {
  const [isOpen, setOpen] = createControllableBooleanSignal({
    value: () => access(props.isOpen),
    defaultValue: () => !!access(props.defaultOpen),
    onChange: value => props.onOpenChange?.(value)
  });

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const toggle = () => {
    setOpen(!isOpen);
  };

  return { isOpen, setOpen, open, close, toggle };
}
