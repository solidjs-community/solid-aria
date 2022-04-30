import { isMac } from "@solid-aria/utils";

export function isCtrlKeyPressed(e: KeyboardEvent) {
  if (isMac()) {
    return e.metaKey;
  }

  return e.ctrlKey;
}
