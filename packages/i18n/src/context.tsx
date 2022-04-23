import { Accessor, createContext, createMemo, JSX, useContext } from "solid-js";

import { createDefaultLocale, Locale } from "./createDefaultLocale";
import { getReadingDirection } from "./utils";

interface I18nProviderProps {
  /**
   * Contents that should have the locale applied.
   */
  children?: JSX.Element;

  /**
   * The locale to apply to the children.
   */
  locale?: string;
}

const I18nContext = createContext<Accessor<Locale>>();

/**
 * Provides the locale for the application to all child components.
 */
export function I18nProvider(props: I18nProviderProps) {
  const defaultLocale = createDefaultLocale();

  const value: Accessor<Locale> = createMemo(() => {
    return props.locale
      ? {
          locale: props.locale,
          direction: getReadingDirection(props.locale)
        }
      : defaultLocale();
  });

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
}

/**
 * Returns an accessor for the current locale and layout direction.
 */
export function useLocale(): Accessor<Locale> {
  const defaultLocale = createDefaultLocale();

  const context = useContext(I18nContext);

  const locale = () => context?.() || defaultLocale();

  return locale;
}
