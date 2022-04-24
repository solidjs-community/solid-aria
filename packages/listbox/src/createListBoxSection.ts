import { DOMElements } from "@solid-aria/types";
import { createId } from "@solid-aria/utils";
import { Accessor, createMemo, JSX } from "solid-js";

interface AriaListBoxSectionProps {
  /**
   * The heading for the section.
   */
  heading?: JSX.Element;

  /**
   * An accessibility label for the section. Required if `heading` is not present.
   */
  "aria-label"?: string;
}

interface ListBoxSectionAria<
  ItemElementType extends DOMElements,
  HeadingElementType extends DOMElements,
  GroupElementType extends DOMElements
> {
  /**
   * Props for the wrapper list item.
   */
  itemProps: Accessor<JSX.IntrinsicElements[ItemElementType]>;

  /**
   * Props for the heading element, if any.
   */
  headingProps: Accessor<JSX.IntrinsicElements[HeadingElementType]>;

  /**
   * Props for the group element.
   */
  groupProps: Accessor<JSX.IntrinsicElements[GroupElementType]>;
}

/**
 * Provides the behavior and accessibility implementation for a section in a listbox.
 * See `createListBox` for more details about listboxes.
 * @param props - Props for the section.
 */
export function createListBoxSection<
  ItemElementType extends DOMElements = "li",
  HeadingElementType extends DOMElements = "span",
  GroupElementType extends DOMElements = "ul"
>(
  props: AriaListBoxSectionProps
): ListBoxSectionAria<ItemElementType, HeadingElementType, GroupElementType> {
  const headingId = createId();

  const itemProps: Accessor<JSX.IntrinsicElements[ItemElementType]> = () => ({
    role: "presentation"
  });

  const headingProps: Accessor<JSX.IntrinsicElements[HeadingElementType]> = createMemo(() => {
    if (!props.heading) {
      return {};
    }

    return {
      // Techincally, listbox cannot contain headings according to ARIA.
      // We hide the heading from assistive technology, and only use it
      // as a label for the nested group.
      id: headingId,
      "aria-hidden": true
    };
  });

  const groupProps: Accessor<JSX.IntrinsicElements[GroupElementType]> = createMemo(() => ({
    role: "group",
    "aria-label": props["aria-label"],
    "aria-labelledby": props.heading ? headingId : undefined
  }));

  return { itemProps, headingProps, groupProps };
}
