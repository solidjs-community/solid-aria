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

import { Accessor, createSignal, createUniqueId, onMount } from "solid-js";

/**
 * Create a universal id that is stable across server/browser.
 * @param prefix An optional prefix for the generated id.
 * @returns The generated id.
 */
export function createId(prefix = "solid-aria"): string {
  return `${prefix}-${createUniqueId()}`;
}

/**
 * Create a universal id that is stable across server/browser.
 * The id will be removed if not attached to an element on mount.
 * @param prefix An optional prefix for the generated id.
 * @returns An accessor for the generated id.
 */
export function createSlotId(prefix?: string): Accessor<string | undefined> {
  const [id, setId] = createSignal<string | undefined>(createId(prefix));

  onMount(() => {
    const _id = id();

    if (_id && !document.getElementById(_id)) {
      setId(undefined);
    }
  });

  return id;
}
