import { mergeProps } from "solid-js";
import { useLocale } from "@solid-aria/i18n";
import { createPagination, createPaginationState, PaginationBase } from "../src";
import { createButton } from "@solid-aria/button";

export function PaginationInput(props: PaginationBase) {
  const propsWithDefault = mergeProps({ defaultValue: 1 }, props);
  const state = createPaginationState(props);
  const { prevButtonProps, nextButtonProps, textProps } = createPagination(propsWithDefault, state);
  const locale = useLocale();
  const direction = () => locale().direction;
  const maxValue = () => props.maxValue;
  let prevButtonRef!: HTMLButtonElement;
  const { buttonProps: pagePrevButtonProps } = createButton(prevButtonProps, () => prevButtonRef);

  let nextButtonRef!: HTMLButtonElement;
  const { buttonProps: pageNextButtonProps } = createButton(nextButtonProps, () => nextButtonRef);

  return (
    <nav>
      <button {...pagePrevButtonProps} ref={prevButtonRef}>
        {direction() === "rtl" ? ">" : "<"}
      </button>
      <input {...textProps} onChange={evt => state.onChange(evt.currentTarget?.value)} />
      <span>Max count: {maxValue()}</span>
      <button {...pageNextButtonProps} ref={nextButtonRef}>
        {direction() === "rtl" ? "<" : ">"}
      </button>
    </nav>
  );
}
