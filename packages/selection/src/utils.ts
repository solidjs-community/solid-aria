import { isMac } from "@solid-aria/utils";

/**
 * Returns whether the `ctrl` key is pressed or not.
 * If MacOS check for the `meta` key instead.
 */
export function isCtrlKeyPressed(e: KeyboardEvent) {
  if (isMac()) {
    return e.metaKey;
  }

  return e.ctrlKey;
}
