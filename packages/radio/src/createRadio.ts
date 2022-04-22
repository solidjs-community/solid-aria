import {
  AriaLabelingProps,
  AriaValidationProps,
  DOMProps,
  FocusableProps,
  InputBase,
  LabelableProps,
  Orientation,
  Validation,
  ValueBase
} from "@solid-aria/types";
import { JSX } from "solid-js";

export interface AriaRadioGroupProps
  extends ValueBase<string>,
    InputBase,
    Validation,
    LabelableProps,
    DOMProps,
    AriaLabelingProps,
    AriaValidationProps {
  /**
   * The Radio(s) contained within the RadioGroup.
   */
  children?: JSX.Element;

  /**
   * The axis the Radio Button(s) should align with.
   * @default 'vertical'
   */
  orientation?: Orientation;

  /**
   * The name of the RadioGroup, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name_and_radio_buttons).
   */
  name?: string;
}

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
