<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Aria&background=tiles&project=Breadcrumbs" alt="Solid Aria - Breadcrumbs">
</p>

# @solid-aria/breadcrumbs

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-cc00ff.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![size](https://img.shields.io/bundlephobia/minzip/@solid-aria/breadcrumbs?style=for-the-badge&label=size)](https://bundlephobia.com/package/@solid-aria/breadcrumbs)
[![version](https://img.shields.io/npm/v/@solid-aria/breadcrumbs?style=for-the-badge)](https://www.npmjs.com/package/@solid-aria/breadcrumbs)
[![stage](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-primitives%2Fmain%2Fassets%2Fbadges%2Fstage-0.json)](https://github.com/solidjs-community/solid-aria#contribution-process)

Breadcrumbs display a heirarchy of links to the current page or resource in an application.

- [`createBreadcrumbs` and `createBreadcrumbItem`](#createbreadcrumbs-and-createbreadcrumbitem) - Provides the behavior and accessibility implementation for a breadcrumbs component.

## Installation

```bash
npm install @solid-aria/breadcrumbs
# or
yarn add @solid-aria/breadcrumbs
# or
pnpm add @solid-aria/breadcrumbs
```

## `createBreadcrumbs` and `createBreadcrumbItem`

Provides the behavior and accessibility implementation for a breadcrumbs component.

### Features

Breadcrumbs provide a list of links to parent pages of the current page in hierarchical order. `createBreadcrumbs` and `createBreadcrumbItem` help implement these in an accessible way.

- Support for mouse, touch, and keyboard interactions on breadcrumbs
- Support for navigation links via `<a>` elements or custom element types via ARIA
- Support for disabled breadcrumbs
- Support for breadcrumbs as a heading

### How to use it

This example displays a basic list of breadcrumbs using an HTML `<nav>` element, and a `<ol>` for the list of links. Each link is a span because we are handling the interactions locally via `onPress`. `createBreadcrumbItem` automatically handles exposing these spans as links to assistive technology.

The chevrons between each link are rendered using a span with `aria-hidden="true"` so that screen readers do not pick them up. You could also render them similarly using SVG icons, CSS `:after`, or other techniques.

The last link is non-interactive since it represents the current page. This is done by adding the `isCurrent` prop.

```tsx
import {
  AriaBreadcrumbItemProps,
  AriaBreadcrumbsProps,
  createBreadcrumbItem,
  createBreadcrumbs
} from "@solid-aria/breadcrumbs";
import { mergeProps, Show } from "solid-js";

function Breadcrumbs(props: AriaBreadcrumbsProps) {
  const { navProps } = createBreadcrumbs(props);

  return (
    <nav {...navProps()}>
      <ol style={{ display: "flex", "list-style": "none", margin: 0, padding: 0 }}>
        {props.children}
      </ol>
    </nav>
  );
}

function BreadcrumbItem(props: AriaBreadcrumbItemProps) {
  let ref: HTMLSpanElement | undefined;

  props = mergeProps({ elementType: "span" }, props);

  const { itemProps } = createBreadcrumbItem<HTMLSpanElement>(props, () => ref);

  return (
    <li>
      <span
        {...itemProps()}
        ref={ref}
        style={{
          color: "blue",
          "text-decoration": props.isCurrent ? undefined : "underline",
          "font-weight": props.isCurrent ? "bold" : undefined,
          cursor: props.isCurrent ? "default" : "pointer"
        }}
      >
        {props.children}
      </span>
      <Show when={!props.isCurrent}>
        <span aria-hidden="true" style={{ padding: "0 5px" }}>
          {"›"}
        </span>
      </Show>
    </li>
  );
}

function App() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem onPress={() => alert("Pressed Folder 1")}>Folder 1</BreadcrumbItem>
      <BreadcrumbItem onPress={() => alert("Pressed Folder 2")}>Folder 2</BreadcrumbItem>
      <BreadcrumbItem isCurrent>Folder 3</BreadcrumbItem>
    </Breadcrumbs>
  );
}
```

### Navigation links

This example is similar to the previous one, except the individual breadcrumbs are native navigation links to other pages rather than handled by JavaScript.

```tsx
import {
  AriaBreadcrumbItemProps,
  AriaBreadcrumbsProps,
  createBreadcrumbItem,
  createBreadcrumbs
} from "@solid-aria/breadcrumbs";
import { JSX, Show } from "solid-js";

function Breadcrumbs(props: AriaBreadcrumbsProps) {
  const { navProps } = createBreadcrumbs(props);

  return (
    <nav {...navProps()}>
      <ol style={{ display: "flex", "list-style": "none", margin: 0, padding: 0 }}>
        {props.children}
      </ol>
    </nav>
  );
}

type BreadcrumbItemProps = AriaBreadcrumbItemProps & JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

function BreadcrumbItem(props: BreadcrumbItemProps) {
  let ref: HTMLAnchorElement | undefined;

  const { itemProps } = createBreadcrumbItem(props, () => ref);

  return (
    <li>
      <a
        {...itemProps()}
        ref={ref}
        href={props.href}
        style={{
          color: "blue",
          "font-weight": props.isCurrent ? "bold" : undefined,
          cursor: props.isCurrent ? "default" : "pointer"
        }}
      >
        {props.children}
      </a>
      <Show when={!props.isCurrent}>
        <span aria-hidden="true" style={{ padding: "0 5px" }}>
          {"›"}
        </span>
      </Show>
    </li>
  );
}

function App() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/solid-aria">Solid Aria</BreadcrumbItem>
      <BreadcrumbItem isCurrent>createBreadcrumbs</BreadcrumbItem>
    </Breadcrumbs>
  );
}
```

### Breadcrumbs as a heading

If you use breadcrumbs in the context where a heading would normally be used, you should make sure that the proper `elementType` for each breadcrumb is communicated to `createBreadcrumbItem` so that you receive the correct `itemProps` to spread on your breadcrumb. This can be seen in the example below where we specify that the last breadcrumb has an `<h3>` and all other breadcrumbs are of type `<a>`.

```tsx
import {
  AriaBreadcrumbItemProps,
  AriaBreadcrumbsProps,
  createBreadcrumbItem,
  createBreadcrumbs
} from "@solid-aria/breadcrumbs";
import { JSX, Show } from "solid-js";

function Breadcrumbs(props: AriaBreadcrumbsProps) {
  const { navProps } = createBreadcrumbs(props);

  return (
    <nav {...navProps()}>
      <ol style={{ display: "flex", "list-style": "none", margin: 0, padding: 0 }}>
        {props.children}
      </ol>
    </nav>
  );
}

type BreadcrumbItemProps = AriaBreadcrumbItemProps & JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

function BreadcrumbItem(props: BreadcrumbItemProps) {
  let ref: any;

  const { itemProps } = createBreadcrumbItem<any, any>(
    {
      ...props,
      get elementType() {
        return props.isCurrent ? "h3" : "a";
      }
    },
    () => ref
  );

  return (
    <li>
      <Show
        when={props.isCurrent}
        fallback={
          <>
            <a
              {...itemProps()}
              ref={ref}
              href={props.href}
              style={{
                color: props.isDisabled ? "gray" : "blue",
                "font-weight": props.isCurrent ? "bold" : undefined,
                cursor: props.isCurrent ? "default" : "pointer"
              }}
            >
              {props.children}
            </a>
            <span aria-hidden="true" style={{ padding: "0 5px" }}>
              {"›"}
            </span>
          </>
        }
      >
        <h3
          {...itemProps()}
          ref={ref}
          style={{
            margin: 0,
            "font-size": "1em",
            color: "blue"
          }}
        >
          {props.children}
        </h3>
      </Show>
    </li>
  );
}

function App() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/solid-aria">Solid Aria</BreadcrumbItem>
      <BreadcrumbItem isCurrent>createBreadcrumbs</BreadcrumbItem>
    </Breadcrumbs>
  );
}
```

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
