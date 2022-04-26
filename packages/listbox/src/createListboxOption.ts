import { DOMElements } from "@solid-aria/types";
import { createSlotId, isMac, isWebKit } from "@solid-aria/utils";
import { Accessor, createMemo, JSX } from "solid-js";

export interface AriaListBoxOptionProps {
  /**
   * The rendered contents of the option.
   */
  children?: JSX.Element;

  /**
   * A screen reader only label for the option.
   */
  "aria-label"?: string;
}

export interface ListBoxOptionAria<
  OptionElementType extends DOMElements,
  LabelElementType extends DOMElements,
  DescriptionElementType extends DOMElements
> {
  /**
   * Props for the option element.
   */
  optionProps: Accessor<JSX.IntrinsicElements[OptionElementType]>;

  /**
   * Props for the main text element inside the option.
   */
  labelProps: Accessor<JSX.IntrinsicElements[LabelElementType]>;

  /**
   * Props for the description text element inside the option, if any.
   */
  descriptionProps: Accessor<JSX.IntrinsicElements[DescriptionElementType]>;
}

/**
 * Provides the behavior and accessibility implementation for an option in a listbox.
 * See `createListBox` for more details about listboxes.
 * @param props - Props for the option.
 * @param state - State for the listbox, as returned by `useListState`.
 */
export function createListBoxOption<
  OptionElementType extends DOMElements = "li",
  LabelElementType extends DOMElements = "span",
  DescriptionElementType extends DOMElements = "span"
>(
  props: AriaListBoxOptionProps
): ListBoxOptionAria<OptionElementType, LabelElementType, DescriptionElementType> {
  const labelId = createSlotId();
  const descriptionId = createSlotId();

  const optionProps: Accessor<JSX.IntrinsicElements[OptionElementType]> = createMemo(() => {
    const baseProps: JSX.IntrinsicElements[OptionElementType] = {
      role: "option"
    };

    // Safari with VoiceOver on macOS misreads options with aria-labelledby or aria-label as simply "text".
    // We should not map the label and description on Safari and instead just have VoiceOver read the textContent.
    // https://bugs.webkit.org/show_bug.cgi?id=209279
    if (isMac() && isWebKit()) {
      return baseProps;
    }

    // TODO: handle aria-selected, aria-disabled and focus state.

    return {
      ...baseProps,
      "aria-label": props["aria-label"],
      "aria-labelledby": labelId(),
      "aria-describedby": descriptionId()
    };
  });

  const labelProps: Accessor<JSX.IntrinsicElements[LabelElementType]> = createMemo(() => ({
    id: labelId()
  }));

  const descriptionProps: Accessor<JSX.IntrinsicElements[DescriptionElementType]> = createMemo(
    () => ({
      id: descriptionId()
    })
  );

  return { optionProps, labelProps, descriptionProps };
}
