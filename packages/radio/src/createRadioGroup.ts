import {
  AriaLabelingProps,
  AriaValidationProps,
  DOMElements,
  DOMProps,
  InputBase,
  LabelableProps,
  Orientation,
  Validation,
  ValueBase
} from "@solid-aria/types";
import { Accessor, JSX } from "solid-js";

import { radioGroupNames } from "./utils";

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

interface RadioGroupAria<T extends DOMElements, U extends DOMElements> {
  /**
   * Props for the radio group wrapper element.
   */
  groupProps: Accessor<JSX.IntrinsicElements[T]>;

  /**
   * Props for the radio group's visible label (if any).
   *  */
  labelProps: Accessor<JSX.IntrinsicElements[U]>;
}
