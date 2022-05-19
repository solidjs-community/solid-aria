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
