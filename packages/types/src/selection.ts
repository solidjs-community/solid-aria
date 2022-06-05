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

import { MaybeAccessor } from "@solid-primitives/utils";

import { ItemKey } from "./collection";

export interface SingleSelection {
  /** Whether the collection allows empty selection. */
  disallowEmptySelection?: MaybeAccessor<boolean | undefined>;

  /** The currently selected key in the collection (controlled). */
  selectedKey?: MaybeAccessor<ItemKey | undefined>;

  /** The initial selected key in the collection (uncontrolled). */
  defaultSelectedKey?: MaybeAccessor<ItemKey | undefined>;

  /** Handler that is called when the selection changes. */
  onSelectionChange?: (key: ItemKey) => any;
}

export type SelectionMode = "none" | "single" | "multiple";
export type SelectionBehavior = "toggle" | "replace";
export type SelectionType = "all" | Set<ItemKey>;

export interface MultipleSelection {
  /** The type of selection that is allowed in the collection. */
  selectionMode?: MaybeAccessor<SelectionMode | undefined>;

  /** Whether the collection allows empty selection. */
  disallowEmptySelection?: MaybeAccessor<boolean | undefined>;

  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: MaybeAccessor<"all" | Iterable<ItemKey> | undefined>;

  /** The initial selected keys in the collection (uncontrolled). */
  defaultSelectedKeys?: MaybeAccessor<"all" | Iterable<ItemKey> | undefined>;

  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: SelectionType) => any;

  /** The currently disabled keys in the collection (controlled). */
  disabledKeys?: MaybeAccessor<Iterable<ItemKey> | undefined>;
}

export type FocusStrategy = "first" | "last";
export type DisabledBehavior = "selection" | "all";
