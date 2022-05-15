import { Component, JSX } from "solid-js";

/**
 * All HTML and SVG elements.
 */
export type DOMElements = keyof JSX.IntrinsicElements;

/**
 * Represent any HTML element or SolidJS component.
 */
export type ElementType<Props = any> = DOMElements | Component<Props>;

/**
 * Allows for extending a set of props (`SourceProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
export type ExtendedProps<SourceProps = {}, OverrideProps = {}> = Omit<
  SourceProps,
  keyof OverrideProps
> &
  OverrideProps;

/**
 * SolidJS ref.
 */
export type Ref<T> = T | ((el: T) => void) | undefined;
