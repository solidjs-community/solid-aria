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

import { AriaLabelingProps, DOMProps } from "@solid-aria/types";
import { mergeAriaLabels } from "@solid-aria/utils";
import { createVisuallyHidden } from "@solid-aria/visually-hidden";
import { splitProps } from "solid-js";

interface DismissButtonProps extends AriaLabelingProps, DOMProps {
  /**
   * Called when the dismiss button is activated.
   */
  onDismiss?: () => void;
}

/**
 * A visually hidden button that can be used to allow screen reader
 * users to dismiss a modal or popup when there is no visual
 * affordance to do so.
 */
export function DismissButton(props: DismissButtonProps) {
  const [local, others] = splitProps(props, ["onDismiss"]);

  const { visuallyHiddenProps } = createVisuallyHidden();

  const { ariaLabelsProps } = mergeAriaLabels(others, "Dismiss");

  const onClick = () => local.onDismiss?.();

  return (
    <div {...visuallyHiddenProps}>
      <button {...ariaLabelsProps} tabIndex={-1} onClick={onClick} />
    </div>
  );
}
