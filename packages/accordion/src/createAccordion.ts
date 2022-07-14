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

import { CollectionBase } from "@solid-aria/collection";
import { createSelectableList } from "@solid-aria/selection";
import { createTreeState, CreateTreeStateProps, TreeState } from "@solid-aria/tree";
import { DOMProps, Expandable } from "@solid-aria/types";
import {
  Accessor,
  createComponent,
  createContext,
  FlowComponent,
  JSX,
  mergeProps,
  useContext
} from "solid-js";

export interface AriaAccordionProps
  extends CollectionBase,
    Expandable,
    DOMProps,
    CreateTreeStateProps {}

export interface AccordionAria {
  /**
   * Provide the accordion state to descendant elements.
   */
  AccordionProvider: FlowComponent;

  /**
   * Props for the accordion container element.
   */
  accordionProps: JSX.HTMLAttributes<HTMLElement>;

  /**
   * State for the accordion, as returned by `createTreeState`.
   */
  state: TreeState;
}

export function createAccordion(
  props: AriaAccordionProps,
  ref: Accessor<HTMLDivElement | undefined>
): AccordionAria {
  const state = createTreeState(props);

  const { listProps } = createSelectableList(
    {
      ...props,
      ...state,
      allowsTabNavigation: true
    },
    ref
  );

  const AccordionProvider: FlowComponent = props => {
    return createComponent(AccordionContext.Provider, {
      value: { state },
      get children() {
        return props.children;
      }
    });
  };

  const accordionProps = mergeProps(listProps, { tabIndex: undefined });

  return { AccordionProvider, accordionProps, state };
}

interface AccordionContextValue {
  /**
   * State for the accordion, as returned by `createTreeState`.
   */
  state: TreeState;
}

const AccordionContext = createContext<AccordionContextValue>();

export function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("[solid-aria]: useAccordionContext should be used in a AccordionProvider.");
  }

  return context;
}
