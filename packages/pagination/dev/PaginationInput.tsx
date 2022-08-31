import { mergeProps } from "solid-js";
import { useLocale } from "@solid-aria/i18n";
import { createPagination, createPaginationState, PaginationBase } from "../src";
import { createButton } from "@solid-aria/button";

export function PaginationInput(props: PaginationBase) {
  const propsWithDefault = mergeProps({ defaultValue: 1 }, props);
  const state = createPaginationState(propsWithDefault);
  const { prevButtonProps, nextButtonProps, textProps } = createPagination(propsWithDefault, state);
  const locale = useLocale();
  const direction = () => locale().direction;
  const maxValue = () => props.maxValue;

  let prevButtonRef!: HTMLButtonElement;
  let nextButtonRef!: HTMLButtonElement;

  const { buttonProps: resolvedPrevButtonProps } = createButton(
    mergeProps(prevButtonProps, {
      get isDisabled() {
        return props.value === 1;
      }
    }),
    () => prevButtonRef
  );

  const { buttonProps: resolvedNextButtonProps } = createButton(
    mergeProps(nextButtonProps, {
      get isDisabled() {
        return props.value === props.maxValue;
      }
    }),
    () => prevButtonRef
  );

  return (
    <>
      <nav>
        <button {...resolvedPrevButtonProps} ref={prevButtonRef}>
          {direction() === "rtl" ? ">" : "<"}
        </button>
        <input
          {...textProps}
          value={state.value()}
          onChange={evt => state.onChange(evt.currentTarget?.value)}
        />
        <button {...resolvedNextButtonProps} ref={nextButtonRef}>
          {direction() === "rtl" ? "<" : ">"}
        </button>
      </nav>
      <span>
        Page: {state.value()} / {maxValue()}
      </span>
    </>
  );
}
