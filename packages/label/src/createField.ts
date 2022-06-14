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

import { HelpTextProps, Validation } from "@solid-aria/types";
import { createSlotId, ID_PREFIX } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { JSX } from "solid-js";

import { AriaLabelProps, createLabel, LabelAria } from "./createLabel";

export interface AriaFieldProps
  extends AriaLabelProps,
    HelpTextProps,
    Omit<Validation, "isRequired"> {}

export interface FieldAria extends LabelAria {
  /**
   * Props for the description element, if any.
   */
  descriptionProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the error message element, if any.
   */
  errorMessageProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the accessibility implementation for input fields.
 * Fields accept user input, gain context from their label, and may display a description or error message.
 * @param props - Props for the Field.
 */
export function createField(props: AriaFieldProps): FieldAria {
  const { labelProps, fieldProps } = createLabel(props);

  const [descriptionId, trackDescIdUse] = createSlotId(ID_PREFIX);
  const [errorMessageId, trackErrorIdUse] = createSlotId(ID_PREFIX);

  const baseFieldProps: JSX.HTMLAttributes<any> = {
    get "aria-describedby"() {
      return (
        [
          descriptionId(),
          // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
          // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
          errorMessageId(),
          props["aria-describedby"]
        ]
          .filter(Boolean)
          .join(" ") || undefined
      );
    }
  };

  const descriptionProps: JSX.HTMLAttributes<any> = {
    get id() {
      trackDescIdUse();
      return descriptionId();
    }
  };

  const errorMessageProps: JSX.HTMLAttributes<any> = {
    get id() {
      trackErrorIdUse();
      return errorMessageId();
    }
  };

  return {
    labelProps,
    fieldProps: combineProps(fieldProps, baseFieldProps),
    descriptionProps,
    errorMessageProps
  };
}
