/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { JSX } from "solid-js";

/**
 * Call the handler with the event.
 * Simpler way to call a JSX.EventHandlerUnion programmatically.
 */
export function callHandler<T, E extends Event>(
  handler: JSX.EventHandlerUnion<T, E> | undefined,
  event: E & { currentTarget: T; target: Element }
) {
  if (handler) {
    if (typeof handler === "function") {
      handler(event);
    } else {
      handler[0](handler[1], event);
    }
  }

  return event?.defaultPrevented;
}

// /**
//  * Return a function that will call all handlers in the order they were chained with the same arguments.
//  */
// export function chainHandlers<T, E extends Event>(
//   ...fns: Array<JSX.EventHandlerUnion<T, E> | undefined>
// ) {
//   return function (event: E & { currentTarget: T; target: Element }) {
//     fns.forEach(fn => callHandler(fn, event));
//   };
// }
