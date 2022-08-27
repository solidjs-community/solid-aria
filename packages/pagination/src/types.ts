import { ValueBase } from "@solid-aria/types";

export type PaginationValue = "" | number;

export interface PaginationBase extends ValueBase<number> {
  maxValue?: number;
  onPrevious?: (value: number, e: Event) => void;
  onNext?: (value: number, e: Event) => void;
}

export interface PaginationProps {
  value?: PaginationValue;
  maxValue?: number;
  defaultValue?: number;
  onChange?: (val: PaginationValue) => void;
}
