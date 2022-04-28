import { AriaLabelingProps, DOMElements, DOMProps, LabelableProps } from "@solid-aria/types";
import { createId, mergeAriaLabels } from "@solid-aria/utils";
import { MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo, JSX, mergeProps, splitProps } from "solid-js";

export interface AriaLabelProps extends LabelableProps, DOMProps, AriaLabelingProps {
  /**
   * Whether the HTML element used to render the label is a <label>.
   * @default true
   */
  isHTMLLabelElement?: MaybeAccessor<boolean | undefined>;
}

export interface LabelAria<T extends DOMElements> {
  /**
   * Props to apply to the label container element.
   */
  labelProps: Accessor<JSX.IntrinsicElements[T]>;

  /**
   * Props to apply to the field container element being labeled.
   */
  fieldProps: Accessor<DOMProps & AriaLabelingProps>;
}

/**
 * Provides the accessibility implementation for labels and their associated elements.
 * Labels provide context for user inputs.
 * @param props - The props for labels and fields.
 */
export function createLabel<T extends DOMElements = "label">(props: AriaLabelProps): LabelAria<T> {
  const defaultFieldId = createId();
  const labelId = createId();

  const defaultProps: AriaLabelProps = {
    id: defaultFieldId,
    isHTMLLabelElement: true
  };

  const propsWithDefault = mergeProps(defaultProps, props);
  const [local] = splitProps(propsWithDefault, [
    "id",
    "label",
    "aria-labelledby",
    "aria-label",
    "isHTMLLabelElement"
  ]);

  const labelProps: Accessor<JSX.IntrinsicElements[T]> = createMemo(() => {
    if (!local.label) {
      return {};
    }

    return {
      id: labelId,
      for: local.isHTMLLabelElement ? local.id : undefined
    };
  });

  const ariaLabelledby = createMemo(() => {
    if (!local.label) {
      return local["aria-labelledby"];
    }

    return local["aria-labelledby"] ? `${local["aria-labelledby"]} ${labelId}` : labelId;
  });

  const { ariaLabelsProps: fieldProps } = mergeAriaLabels({
    id: () => local.id,
    "aria-label": () => local["aria-label"],
    "aria-labelledby": ariaLabelledby
  });

  return { labelProps, fieldProps };
}
