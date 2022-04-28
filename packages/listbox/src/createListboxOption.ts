import { DOMElements } from "@solid-aria/types";
import { createId, createSlotId, isMac, isWebKit } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo, JSX, onCleanup, onMount } from "solid-js";

import { useListBoxContext } from "./context";

export interface AriaListBoxOptionProps {
  /**
   * The value of the option.
   */
  value: string;

  /**
   * A string value for this node, used for features like typeahead.
   */
  textValue?: string;

  /**
   * Whether the option is disabled.
   */
  isDisabled?: boolean;

  /**
   * A screen reader only label for the option.
   */
  "aria-label"?: string;

  /**
   * The rendered contents of the option.
   */
  children?: JSX.Element;
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
 * @param ref - A ref for the HTML option element.
 */
export function createListBoxOption<
  OptionElementType extends DOMElements = "li",
  LabelElementType extends DOMElements = "span",
  DescriptionElementType extends DOMElements = "span"
>(
  props: AriaListBoxOptionProps,
  ref?: MaybeAccessor<HTMLElement>
): ListBoxOptionAria<OptionElementType, LabelElementType, DescriptionElementType> {
  const context = useListBoxContext();

  const key = createId();

  const labelId = createSlotId();
  const descriptionId = createSlotId();

  const optionProps: Accessor<JSX.IntrinsicElements[OptionElementType]> = createMemo(() => {
    // TODO: handle focus state.

    const baseProps: JSX.IntrinsicElements[OptionElementType] = {
      id: key,
      role: "option",
      tabIndex: -1,
      "aria-selected": context.isSelected(key),
      "aria-disabled": props.isDisabled
    };

    // Safari with VoiceOver on macOS misreads options with aria-labelledby or aria-label as simply "text".
    // We should not map the label and description on Safari and instead just have VoiceOver read the textContent.
    // https://bugs.webkit.org/show_bug.cgi?id=209279
    if (isMac() && isWebKit()) {
      return baseProps;
    }

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

  onMount(() => {
    const elementRef = access(ref);

    if (!elementRef) {
      return;
    }

    context.registerOption({
      key,
      value: props.value,
      textValue: props.textValue ?? elementRef?.textContent ?? "",
      isDisabled: props.isDisabled ?? false
    });

    onCleanup(() => {
      context.unregisterOption(key);
    });
  });

  return { optionProps, labelProps, descriptionProps };
}
