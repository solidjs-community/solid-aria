import {
  AriaLabelingProps,
  ElementType,
  FocusableDOMProps,
  FocusableProps,
  PressEvents
} from "@solid-aria/types";
import { JSX } from "solid-js";

interface ButtonProps extends PressEvents, FocusableProps {
  /**
   * Whether the button is disabled.
   */
  isDisabled?: boolean;

  /**
   * The content to display in the button.
   */
  children?: JSX.Element;
}

interface ToggleButtonProps extends ButtonProps {
  /**
   * Whether the element should be selected (controlled).
   */
  isSelected?: boolean;

  /**
   * Whether the element should be selected (uncontrolled).
   */
  defaultSelected?: boolean;

  /**
   * Handler that is called when the element's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;
}

export interface AriaButtonElementTypeProps<T extends ElementType = "button"> {
  /**
   * The HTML element or SolidJS component used to render the button, e.g. 'div', 'a', or `Link`.
   * @default 'button'
   */
  elementType?: T;
}

export interface LinkButtonProps<T extends ElementType = "button">
  extends AriaButtonElementTypeProps<T> {
  /**
   * A URL to link to if elementType="a".
   */
  href?: string;

  /**
   * The target window for the link.
   */
  target?: string;

  /**
   * The relationship between the linked resource and the current page.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel).
   */
  rel?: string;
}

interface AriaBaseButtonProps extends FocusableDOMProps, AriaLabelingProps {
  /**
   * Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
   */
  "aria-expanded"?: boolean;

  /**
   * Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
   */
  "aria-haspopup"?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";

  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   */
  "aria-controls"?: string;

  /**
   * Indicates the current "pressed" state of toggle buttons. */
  "aria-pressed"?: boolean;

  /**
   * The behavior of the button when used in an HTML form.
   * @default 'button'
   */
  type?: "button" | "submit" | "reset";

  /**
   * Whether the button should not receive focus on press.
   */
  preventFocusOnPress?: boolean;

  /**
   * Whether the button can receive focus when disabled.
   */
  allowFocusWhenDisabled?: boolean;

  /**
   * Handler that is called when the click is released over the target.
   */
  onClick?: (e: MouseEvent) => void;
}

export interface AriaButtonProps<T extends ElementType = "button">
  extends ButtonProps,
    LinkButtonProps<T>,
    AriaBaseButtonProps {}

export interface AriaToggleButtonProps<T extends ElementType = "button">
  extends ToggleButtonProps,
    AriaBaseButtonProps,
    AriaButtonElementTypeProps<T> {}
