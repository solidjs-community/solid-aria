<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=I18n" alt="Solid Aria - I18n">
</p>

# @solid-aria/i18n

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/i18n?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/i18n)
[![version](https://img.shields.io/npm/v/@solid-aria/i18n?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/i18n)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Primitives for working with locales and layout direction.

- [`I18nProvider`](#I18nProvider) - Provides the locale for the application to all child components.
- [`useLocale`](#useLocale) - Returns the current locale and layout direction.

## Installation

```bash
npm install @solid-aria/i18n
# or
yarn add @solid-aria/i18n
# or
pnpm add @solid-aria/i18n
```

## `I18nProvider`

`I18nProvider` allows you to override the default locale as determined by the browser/system setting with a locale defined by your application (e.g. application setting). This should be done by wrapping your entire application in the provider, which will be cause all child elements to receive the new locale information via `useLocale`.

### How to use it

```tsx
import { I18nProvider } from "@solid-aria/i18n";

function App() {
  return (
    <I18nProvider locale="fr-FR">
      <YourApp />
    </I18nProvider>
  );
}
```

## `useLocale`

`useLocale` allows components to access the current locale and interface layout direction. By default, this is automatically detected based on the browser or system language, but it can be overridden by using the `I18nProvider` at the root of your app.

`useLocale` should be used in the root of your app to define the [lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) and [dir](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) attributes so that the browser knows which language and direction the user interface should be rendered in.

### How to use it

```tsx
import { useLocale } from "@solid-aria/i18n";

function App() {
  const locale = useLocale();

  return (
    <div lang={locale().locale} dir={locale().direction}>
      {/* your app here */}
    </div>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
