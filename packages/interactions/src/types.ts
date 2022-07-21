import { PressEvents } from "@solid-aria/types";
import { MaybeAccessor } from "@solid-primitives/utils";
import { Ref } from "solid-js";

// moved here to avoid circular import
export interface CreatePressProps<T extends HTMLElement> extends PressEvents {
  /**
   * Whether the target is in a controlled press state (e.g. an overlay it triggers is open).
   */
  isPressed?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the press events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the target should not receive focus on press.
   */
  preventFocusOnPress?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether press events should be canceled when the pointer leaves the target while pressed.
   * By default, this is `false`, which means if the pointer returns back over the target while
   * still pressed, onPressStart will be fired again. If set to `true`, the press is canceled
   * when the pointer leaves the target and onPressStart will not be fired if the pointer returns.
   */
  shouldCancelOnPointerExit?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether text selection should be enabled on the pressable element.
   */
  allowTextSelectionOnPress?: MaybeAccessor<boolean | undefined>;

  /**
   * A ref to the target element.
   */
  ref?: Ref<T>;
}
