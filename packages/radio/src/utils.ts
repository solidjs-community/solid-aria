import { RadioGroupState } from "./createRadioGroupState";

/**
 * key/value pair of `RadioGroupState` and radio group name.
 * Used to pass `name` prop to descendant `createRadio`,
 * since we can't use context with only primitives.
 */
export const radioGroupNames = new WeakMap<RadioGroupState, string | undefined>();
