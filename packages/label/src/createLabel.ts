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

import { AriaLabelingProps, DOMElements, DOMProps, LabelableProps } from "@solid-aria/types";
import { createId, mergeAriaLabels } from "@solid-aria/utils";
import { MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo, JSX, mergeProps, splitProps } from "solid-js";

export interface AriaLabelProps extends LabelableProps, DOMProps, AriaLabelingProps {
  /**
   * Whether the HTML element used to render the label is a <label>.
   * @default true
   */
  isHTMLLabelElement?: MaybeAccessor<boolean | undefined>;
}

export interface LabelAria<T extends DOMElements> {
  /**
   * Props to apply to the label container element.
   */
  labelProps: Accessor<JSX.IntrinsicElements[T]>;

  /**
   * Props to apply to the field container element being labeled.
   */
  fieldProps: Accessor<DOMProps & AriaLabelingProps>;
}

/**
 * Provides the accessibility implementation for labels and their associated elements.
 * Labels provide context for user inputs.
 * @param props - The props for labels and fields.
 */
export function createLabel<T extends DOMElements = "label">(props: AriaLabelProps): LabelAria<T> {
  const defaultFieldId = createId();
  const labelId = createId();

  const defaultProps: AriaLabelProps = {
    id: defaultFieldId,
    isHTMLLabelElement: true
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const [local] = splitProps(props, [
    "id",
    "label",
    "aria-labelledby",
    "aria-label",
    "isHTMLLabelElement"
  ]);

  const labelProps: Accessor<JSX.IntrinsicElements[T]> = createMemo(() => {
    if (!local.label) {
      return {};
    }

    return {
      id: labelId,
      for: local.isHTMLLabelElement ? local.id : undefined
    };
  });

  const ariaLabelledby = createMemo(() => {
    if (!local.label) {
      return local["aria-labelledby"];
    }

    return local["aria-labelledby"] ? `${local["aria-labelledby"]} ${labelId}` : labelId;
  });

  const { ariaLabelsProps: fieldProps } = mergeAriaLabels({
    id: () => local.id,
    "aria-label": () => local["aria-label"],
    "aria-labelledby": ariaLabelledby
  });

  return { labelProps, fieldProps };
}
