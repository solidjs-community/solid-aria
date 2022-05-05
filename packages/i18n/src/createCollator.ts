import { Accessor, createMemo } from "solid-js";

import { useLocale } from "./context";

const cache = new Map<string, Intl.Collator>();

/**
 * Provides localized string collation for the current locale. Automatically updates when the locale changes,
 * and handles caching of the collator for performance.
 * @param options - Collator options.
 */
export function createCollator(options?: Intl.CollatorOptions): Accessor<Intl.Collator> {
  const locale = useLocale();

  const cacheKey = createMemo(() => {
    return (
      locale().locale +
      (options
        ? Object.entries(options)
            .sort((a, b) => (a[0] < b[0] ? -1 : 1))
            .join()
        : "")
    );
  });

  const formatter = createMemo(() => {
    const key = cacheKey();
    let collator: Intl.Collator | undefined;

    if (cache.has(key)) {
      collator = cache.get(key);
    }

    if (!collator) {
      collator = new Intl.Collator(locale().locale, options);
      cache.set(key, collator);
    }

    return collator;
  });

  return formatter;
}
