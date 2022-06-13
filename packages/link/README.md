<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Link" alt="Solid Aria - Link">
</p>

# @solid-aria/link

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/link?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/link)
[![version](https://img.shields.io/npm/v/@solid-aria/link?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/link)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

A link allows a user to navigate to another page or resource within a web page or application.

- [`createLink`](#createlink) - Provides the behavior and accessibility implementation for a link component.

## Installation

```bash
npm install @solid-aria/link
# or
yarn add @solid-aria/link
# or
pnpm add @solid-aria/link
```

## `createLink`

Provides the behavior and accessibility implementation for a link component.

### Features

Links can be created in HTML with the `<a>` element with an href attribute. However, if the link does not have an href, and is handled client side with JavaScript instead, it will not be exposed to assistive technology properly. `createLink` helps achieve accessible links with either native HTML elements or custom element types.

- Support for mouse, touch, and keyboard interactions
- Support for navigation links via `<a>` elements or custom element types via ARIA
- Support for disabled links

### How to use it

This example shows a basic link using a native `<a>` element.

```tsx
import { AriaLinkProps, createLink } from "@solid-aria/link";
import { JSX } from "solid-js";

type LinkProps = AriaLinkProps & JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

function Link(props: LinkProps) {
  let ref: HTMLAnchorElement | undefined;

  const { linkProps } = createLink(props, () => ref);

  return (
    <a {...linkProps} ref={ref} href={props.href} target={props.target} style={{ color: "blue" }}>
      {props.children}
    </a>
  );
}

function App() {
  return (
    <Link href="https://www.solidjs.com" target="_blank">
      SolidJS
    </Link>
  );
}
```

### Client handled links

This example shows a client handled link using press events. It sets `elementType` to `span` so that `createLink` returns the proper ARIA attributes to expose the element as a link to assistive technology.

In addition, this example shows usage of the `isPressed` value returned by `createLink` to properly style the links's active state. You could use the CSS `:active` pseudo class for this, but `isPressed` properly handles when the user drags their pointer off of the link, along with keyboard support and better touch screen support.

```tsx
import { AriaLinkProps, createLink } from "@solid-aria/link";
import { JSX, mergeProps } from "solid-js";

type LinkProps = AriaLinkProps & JSX.HTMLAttributes<HTMLSpanElement>;

function Link(props: LinkProps) {
  let ref: HTMLSpanElement | undefined;

  props = mergeProps({ elementType: "span" }, props);

  const { linkProps, isPressed } = createLink<"span", HTMLSpanElement>(props, () => ref);

  return (
    <span
      {...linkProps}
      ref={ref}
      style={{
        color: isPressed() ? "blue" : "dodgerblue",
        "text-decoration": "underline",
        cursor: "pointer"
      }}
    >
      {props.children}
    </span>
  );
}

function App() {
  return <Link onPress={() => alert("Pressed link")}>SolidJS</Link>;
}
```

### Disabled links

A link can be disabled by passing the `isDisabled` property. This will work with both native link elements as well as client handled links. Native navigation will be disabled, and the `onPress` event will not be fired. The link will be exposed as disabled to assistive technology with ARIA.

```tsx
import { AriaLinkProps, createLink } from "@solid-aria/link";
import { JSX } from "solid-js";

type LinkProps = AriaLinkProps & JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

function Link(props: LinkProps) {
  let ref: HTMLAnchorElement | undefined;

  const { linkProps } = createLink(props, () => ref);

  return (
    <a
      {...linkProps}
      ref={ref}
      href={props.href}
      target={props.target}
      style={{
        color: props.isDisabled ? "gray" : "blue",
        cursor: props.isDisabled ? "default" : "pointer"
      }}
    >
      {props.children}
    </a>
  );
}

function App() {
  return (
    <Link href="https://www.solidjs.com" target="_blank" isDisabled>
      Disabled link
    </Link>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
