import { AriaLabelingProps, DOMProps, FocusableProps } from "@solid-aria/types";
import { JSX } from "solid-js";

export interface AriaRadioProps extends FocusableProps, DOMProps, AriaLabelingProps {
  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string;

  /**
   * The label for the Radio. Accepts any renderable node.
   */
  children?: JSX.Element;

  /**
   * Whether the radio button is disabled or not.
   * Shows that a selection exists, but is not available in that circumstance.
   */
  isDisabled?: boolean;
}
