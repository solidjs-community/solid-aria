import { createToggleState } from "@solid-aria/toggle";
import { ElementType } from "@solid-aria/types";
import { chain, combineProps } from "@solid-aria/utils";
import { Accessor, createMemo, JSX, mergeProps } from "solid-js";

import { ButtonAria, createButton } from "./createButton";
import { AriaToggleButtonProps } from "./types";

export function createToggleButton(
  props: AriaToggleButtonProps<"a">,
  ref: Accessor<HTMLAnchorElement | undefined>
): ButtonAria<JSX.AnchorHTMLAttributes<HTMLAnchorElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<"button">,
  ref: Accessor<HTMLButtonElement | undefined>
): ButtonAria<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<"div">,
  ref: Accessor<HTMLDivElement | undefined>
): ButtonAria<JSX.HTMLAttributes<HTMLDivElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<"input">,
  ref: Accessor<HTMLInputElement | undefined>
): ButtonAria<JSX.InputHTMLAttributes<HTMLInputElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<"span">,
  ref: Accessor<HTMLSpanElement | undefined>
): ButtonAria<JSX.HTMLAttributes<HTMLSpanElement>>;

export function createToggleButton(
  props: AriaToggleButtonProps<ElementType>,
  ref: Accessor<HTMLElement | undefined>
): ButtonAria<JSX.HTMLAttributes<HTMLElement>>;

/**
 * Provides the behavior and accessibility implementation for a toggle button component.
 * ToggleButtons allow users to toggle a selection on or off, for example switching between two states or modes.
 * @param props - Props to be applied to the button.
 * @param ref - A ref to a DOM element for the button.
 */
export function createToggleButton(
  props: AriaToggleButtonProps<ElementType>,
  ref: Accessor<any>
): ButtonAria<JSX.HTMLAttributes<any>> {
  const state = createToggleState(props);

  const createButtonProps = mergeProps(props, {
    onPress: chain(state.toggle, props.onPress)
  });

  const { isPressed, buttonProps: baseButtonProps } = createButton(createButtonProps, ref);

  const buttonProps = createMemo(() => {
    return combineProps(baseButtonProps, { "aria-pressed": state.isSelected() });
  });

  return { buttonProps, isPressed };
}
