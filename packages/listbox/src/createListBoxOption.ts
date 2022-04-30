import { createKeyboard, createPress } from "@solid-aria/interactions";
import { DOMElements } from "@solid-aria/types";
import { combineProps, createSlotId, isMac, isWebKit } from "@solid-aria/utils";
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
  OptionElement extends DOMElements,
  LabelElement extends DOMElements,
  DescriptionElement extends DOMElements
> {
  /**
   * Props for the option element.
   */
  optionProps: Accessor<JSX.IntrinsicElements[OptionElement]>;

  /**
   * Props for the main text element inside the option.
   */
  labelProps: Accessor<JSX.IntrinsicElements[LabelElement]>;

  /**
   * Props for the description text element inside the option, if any.
   */
  descriptionProps: Accessor<JSX.IntrinsicElements[DescriptionElement]>;

  /**
   * Whether the option is currently selected.
   */
  isSelected: Accessor<boolean>;

  /**
   * Whether the option is currently focused.
   */
  isFocused: Accessor<boolean>;

  /**
   * Whether the option is disabled.
   */
  isDisabled: Accessor<boolean>;
}

/**
 * Provides the behavior and accessibility implementation for an option in a listbox.
 * See `createListBox` for more details about listboxes.
 * @param props - Props for the option.
 * @param ref - A ref for the HTML option element.
 */
export function createListBoxOption<
  OptionElement extends DOMElements = "li",
  LabelElement extends DOMElements = "span",
  DescriptionElement extends DOMElements = "span",
  RefElement extends HTMLElement = HTMLLIElement
>(
  props: AriaListBoxOptionProps,
  ref: MaybeAccessor<RefElement | undefined>
): ListBoxOptionAria<OptionElement, LabelElement, DescriptionElement> {
  const context = useListBoxContext();

  const labelId = createSlotId();
  const descriptionId = createSlotId();

  // since option value should be unique we can use it as key for focus and selection management.
  const key = () => props.value;

  const isSelected = createMemo(() => {
    // hack to track the selected keys changes.
    context.selectionManager.selectedKeys();

    return context.selectionManager.isSelected(key());
  });

  const isFocused = createMemo(() => {
    // hack to track the currently focused key changes.
    context.focusManager.focusedKey();

    return context.focusManager.isFocusedKey(key());
  });

  const isDisabled = createMemo(() => props.isDisabled ?? false);

  const focusAndSelect = () => {
    context.focusManager.setFocusedKey(key());

    // When selectOnFocus=true, selection is automatically handled by an effect in the ListBoxState.
    // Otherwise, we manually select the option.
    if (!context.selectOnFocus()) {
      context.selectionManager.select(key());
    }
  };

  const { pressProps } = createPress({
    isDisabled,
    onClick: focusAndSelect
  });

  const { keyboardProps } = createKeyboard({
    isDisabled,
    onKeyDown: event => ["Enter", " "].includes(event.key) && focusAndSelect()
  });

  const optionProps: Accessor<JSX.IntrinsicElements[OptionElement]> = createMemo(() => {
    const baseProps = combineProps(pressProps(), keyboardProps(), {
      role: "option",
      tabIndex: isFocused() ? 0 : -1,
      "aria-selected": isSelected() || undefined,
      "aria-disabled": isDisabled() || undefined
    }) as JSX.IntrinsicElements[OptionElement];

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

  const labelProps: Accessor<JSX.IntrinsicElements[LabelElement]> = createMemo(() => ({
    id: labelId()
  }));

  const descriptionProps: Accessor<JSX.IntrinsicElements[DescriptionElement]> = createMemo(() => ({
    id: descriptionId()
  }));

  onMount(() => {
    const elementRef = access(ref);

    if (!elementRef) {
      return;
    }

    context.registerOption({
      key: key(),
      ref: elementRef,
      textValue: props.textValue ?? elementRef.textContent ?? "",
      isDisabled
    });

    onCleanup(() => {
      context.unregisterOption(key());
    });
  });

  return {
    optionProps,
    labelProps,
    descriptionProps,
    isSelected,
    isFocused,
    isDisabled
  };
}
