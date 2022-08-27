/*
 * Copyright 2022 Solid Aria Working Group.
 * MIT License
 *
 * Portions of this file are based on code from react-spectrum.
 * Copyright 2020 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { createStringFormatter } from "@solid-aria/i18n";
import { JSX, mergeProps } from "solid-js";
import intlMessages from "../intl";
import { PaginationState } from "./createPaginationState";

export interface PaginationAriaProps {
  onPrevious?: (value: number, ...args: any) => void;
  onNext?: (value: number, ...args: any) => void;
}

interface PaginationAria {
  prevButtonProps: JSX.ButtonHTMLAttributes<any> & {
    onPress: () => void;
  };
  nextButtonProps: JSX.ButtonHTMLAttributes<any> & {
    onPress: () => void;
  };
  textProps: JSX.HTMLAttributes<any>;
}

export function createPagination(
  props: PaginationAriaProps,
  state: PaginationState
): PaginationAria {
  const stringFormatter = createStringFormatter(intlMessages);

  const onPrevious = () => {
    state.onDecrement();
    const value = state.value();
    if (props.onPrevious && value) {
      props.onPrevious(value);
    }
  };

  const onNext = () => {
    state.onIncrement();
    const value = state.value();
    if (props.onNext && value) {
      props.onNext(value);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
      case "Up":
        state.onIncrement();
        break;
      case "ArrowDown":
      case "Down":
        state.onDecrement();
        break;
      case "Enter":
      case " ":
        break;
      default:
    }
  };

  return {
    prevButtonProps: {
      get "aria-label"() {
        return stringFormatter().format("previous");
      },
      onPress: onPrevious
    },
    nextButtonProps: {
      get "aria-label"() {
        return stringFormatter().format("next");
      },
      onPress: onNext
    },
    textProps: mergeProps(props, {
      onKeyDown: onKeyDown
    })
  };
}
