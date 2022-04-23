import { Direction } from "@solid-aria/types";
import { Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { getReadingDirection } from "./utils";

export interface Locale {
  /**
   * The [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) language code for the locale.
   */
  locale: string;

  /**
   * The writing direction for the locale.
   */
  direction: Direction;
}

/**
 * Gets the locale setting of the browser.
 */
export function getDefaultLocale(): Locale {
  const locale =
    // eslint-disable-next-line
    // @ts-ignore
    (typeof navigator !== "undefined" && (navigator.language || navigator.userLanguage)) || "en-US";

  return {
    locale,
    direction: getReadingDirection(locale)
  };
}

let currentLocale = getDefaultLocale();
const listeners = new Set<(locale: Locale) => void>();

function updateLocale() {
  currentLocale = getDefaultLocale();

  for (const listener of listeners) {
    listener(currentLocale);
  }
}

/**
 * Returns an accessor for the current browser/system language, and updates when it changes.
 */
export function createDefaultLocaleObserver(): Accessor<Locale> {
  // We cannot determine the browser's language on the server, so default to en-US.
  // This will be updated after hydration on the client to the correct value.
  const defaultSSRLocale: Locale = {
    locale: "en-US",
    direction: "ltr"
  };

  const [locale, setLocale] = createSignal(currentLocale);

  const defaultLocale = createMemo(() => (isServer ? defaultSSRLocale : locale()));

  onMount(() => {
    if (listeners.size === 0) {
      window.addEventListener("languagechange", updateLocale);
    }

    listeners.add(setLocale);

    onCleanup(() => {
      listeners.delete(setLocale);

      if (listeners.size === 0) {
        window.removeEventListener("languagechange", updateLocale);
      }
    });
  });

  return defaultLocale;
}
