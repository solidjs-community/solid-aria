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

import { AriaLabelingProps } from "@solid-aria/types";
import { isServer } from "@solid-primitives/utils";
import { Accessor, createEffect, createSignal, on, onCleanup } from "solid-js";

let descriptionId = 0;
const descriptionNodes = new Map<string, { refCount: number; element: HTMLElement }>();

export function createDescription(description: Accessor<string | undefined>): AriaLabelingProps {
  const [id, setId] = createSignal<string>();

  createEffect(
    on(description, newDescription => {
      if (!newDescription || isServer) {
        return;
      }

      let desc = descriptionNodes.get(newDescription);
      if (!desc) {
        const id = `solid-aria-description-${descriptionId++}`;
        setId(id);

        const node = document.createElement("div");
        node.id = id;
        node.style.display = "none";
        node.textContent = newDescription;
        document.body.appendChild(node);
        desc = { refCount: 0, element: node };
        descriptionNodes.set(newDescription, desc);
      } else {
        setId(desc.element.id);
      }

      desc.refCount++;
      onCleanup(() => {
        if (desc && --desc.refCount === 0) {
          desc.element.remove();
          descriptionNodes.delete(newDescription);
        }
      });
    })
  );

  const descriptionProps: AriaLabelingProps = {
    get "aria-describedby"() {
      return description() ? id() : undefined;
    }
  };

  return descriptionProps;
}
