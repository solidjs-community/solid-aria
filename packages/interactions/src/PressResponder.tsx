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

import { combineProps } from "@solid-primitives/props";
import { createSignal, JSX, mergeProps, onMount, Ref, useContext } from "solid-js";

import { PressResponderContext, PressResponderContextValue } from "./PressResponderContext";
import { CreatePressProps } from "./types";

export interface PressResponderProps<T extends HTMLElement> extends CreatePressProps {
  children: JSX.Element;
  ref?: Ref<T | undefined>;
}

/**
 * Handle press events on child pressable element (e.g. element using the `createPress` primitive).
 */
export function PressResponder<T extends HTMLElement>(props: PressResponderProps<T>) {
  const [isRegistered, setIsRegistered] = createSignal(false);

  const prevContext = useContext(PressResponderContext);

  const baseContext = mergeProps(props, {
    ref: props.ref || prevContext?.ref,
    register() {
      setIsRegistered(true);

      if (prevContext) {
        prevContext.register();
      }
    }
  } as PressResponderContextValue);

  const context = combineProps(prevContext || {}, baseContext);

  onMount(() => {
    if (!isRegistered()) {
      console.warn(
        "[solid-aria]: A PressResponder was rendered without a pressable child. " +
          "Ensure the PressResponder have a child calling the createPress primitive."
      );
    }
  });

  return (
    <PressResponderContext.Provider value={context}>
      {props.children}
    </PressResponderContext.Provider>
  );
}
