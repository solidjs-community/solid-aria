import { getInteractionModality } from "@solid-aria/interactions";
import { focusWithoutScrolling, runAfterTransition } from "@solid-aria/utils";

/**
 * A utility function that focuses an element while avoiding undesired side effects such
 * as page scrolling and screen reader issues with CSS transitions.
 */
export function focusSafely(element: HTMLElement) {
  // If the user is interacting with a virtual cursor, e.g. screen reader, then
  // wait until after any animated transitions that are currently occurring on
  // the page before shifting focus. This avoids issues with VoiceOver on iOS
  // causing the page to scroll when moving focus if the element is transitioning
  // from off the screen.
  if (getInteractionModality() === "virtual") {
    const lastFocusedElement = document.activeElement;

    runAfterTransition(() => {
      // If focus did not move and the element is still in the document, focus it.
      if (document.activeElement === lastFocusedElement && document.contains(element)) {
        focusWithoutScrolling(element);
      }
    });
  } else {
    focusWithoutScrolling(element);
  }
}
