import { MaybeAccessor } from "@solid-primitives/utils";
import { JSX } from "solid-js";

import { AriaLabelingProps } from "./aria";
import { DOMProps } from "./dom";
import { ElementType } from "./element";

export interface LabelableProps {
  /**
   * The content to display as the label.
   * */
  label?: JSX.Element;
}

export interface LabelAriaProps extends LabelableProps, DOMProps, AriaLabelingProps {
  /**
   * The HTML element used to render the label, e.g. 'label', or 'span'.
   * @default 'label'
   */
  labelElementType?: MaybeAccessor<ElementType | undefined>;
}
