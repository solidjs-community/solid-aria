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

import { AriaLabelProps, createLabel } from "@solid-aria/label";
import {
  AriaLabelingProps,
  AriaValidationProps,
  DOMProps,
  InputBase,
  LabelableProps,
  ValueBase
} from "@solid-aria/types";
import { filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import {
  Accessor,
  createComponent,
  createContext,
  FlowComponent,
  JSX,
  mergeProps,
  useContext
} from "solid-js";

import { CheckboxGroupState, createCheckboxGroupState } from "./createCheckboxGroupState";

interface CheckboxGroupContextValue {
  /**
   * State for the checkbox group, as returned by `createCheckboxGroupState`.
   */
  state: CheckboxGroupState;

  /**
   * The name of the CheckboxGroup, used when submitting an HTML form.
   */
  name: Accessor<string | undefined>;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue>();

export interface AriaCheckboxGroupProps
  extends ValueBase<string[]>,
    InputBase,
    LabelableProps,
    DOMProps,
    AriaLabelingProps,
    AriaValidationProps {
  /**
   * The Checkboxes contained within the CheckboxGroup.
   */
  children?: JSX.Element;

  /**
   * The name of the CheckboxGroup, used when submitting an HTML form.
   */
  name?: string;
}

interface CheckboxGroupAria {
  /**
   * Provide the checkbox group state to descendant elements.
   */
  CheckboxGroupProvider: FlowComponent;

  /**
   * Props for the checkbox group wrapper element.
   */
  groupProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the checkbox group's visible label (if any).
   *  */
  labelProps: JSX.HTMLAttributes<any>;

  /**
   * State for the checkbox group, as returned by `createCheckboxGroupState`.
   */
  state: CheckboxGroupState;
}

/**
 * Provides the behavior and accessibility implementation for a checkbox group component.
 * Checkbox groups allow users to select multiple items from a list of options.
 * @param props - Props for the checkbox group.
 */
export function createCheckboxGroup(props: AriaCheckboxGroupProps): CheckboxGroupAria {
  const state = createCheckboxGroupState(props);

  const defaultCreateLabelProps: AriaLabelProps = {
    // Checkbox group is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    isHTMLLabelElement: false
  };

  const createLabelProps = mergeProps(defaultCreateLabelProps, props);

  const { labelProps, fieldProps } = createLabel(createLabelProps);

  const domProps = filterDOMProps(props, { labelable: true });

  const baseGroupProps = mergeProps(
    {
      role: "group",
      get "aria-disabled"() {
        return props.isDisabled || undefined;
      }
    } as JSX.HTMLAttributes<any>,
    fieldProps
  );

  const groupProps = combineProps(domProps, baseGroupProps);

  const name = () => props.name;

  const CheckboxGroupProvider: FlowComponent = props => {
    return createComponent(CheckboxGroupContext.Provider, {
      value: { state, name },
      get children() {
        return props.children;
      }
    });
  };

  return { CheckboxGroupProvider, groupProps, labelProps, state };
}

export function useCheckboxGroupContext() {
  const context = useContext(CheckboxGroupContext);

  if (!context) {
    throw new Error(
      "[solid-aria]: useCheckboxGroupContext should be used in a CheckboxGroupProvider."
    );
  }

  return context;
}
