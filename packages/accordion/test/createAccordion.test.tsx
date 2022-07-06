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

import { ForItems, Item } from "@solid-aria/collection";
import { filterDOMProps } from "@solid-aria/utils";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { createMemo, For, mergeProps } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import {
  AriaAccordionItemProps,
  AriaAccordionProps,
  createAccordion,
  createAccordionItem
} from "../src";

function AccordionItem(props: AriaAccordionItemProps) {
  let ref: HTMLButtonElement | undefined;

  const { buttonProps, regionProps } = createAccordionItem(props, () => ref);

  return (
    <div>
      <h3>
        <button {...buttonProps} ref={ref}>
          {props.item.props.title}
        </button>
      </h3>
      <div {...regionProps}>{props.item.props.children}</div>
    </div>
  );
}

function Accordion(props: AriaAccordionProps) {
  let ref: HTMLDivElement | undefined;

  const { AccordionProvider, accordionProps, state } = createAccordion(props, () => ref);

  const rootProps = mergeProps(
    createMemo(() => filterDOMProps(props)),
    accordionProps
  );

  return (
    <div {...rootProps} ref={ref}>
      <AccordionProvider>
        {props.children}
        <ForItems in={state.collection()}>{item => <AccordionItem item={item()} />}</ForItems>
      </AccordionProvider>
    </div>
  );
}

const items = [
  { key: "one", title: "one title", children: "one children" },
  { key: "two", title: "two title", children: "two children" },
  { key: "three", title: "three title", children: "three children" }
];

function Example(props: any) {
  return (
    <Accordion {...props} defaultExpandedKeys={["one"]}>
      <For each={items}>
        {item => (
          <Item key={item.key} title={item.title}>
            {item.children}
          </Item>
        )}
      </For>
    </Accordion>
  );
}

describe("createAccordion", () => {
  it("renders properly", () => {
    render(() => <Example />);

    const accordionItems = screen.getAllByRole("heading");

    expect(items.length).toBe(3);

    for (const item of accordionItems) {
      const button = within(item).getByRole("button");
      expect(button).toHaveAttribute("aria-expanded");

      const isExpanded = button.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        expect(button).toHaveAttribute("aria-controls");

        const region = document.getElementById(button.getAttribute("aria-controls") ?? "");
        expect(region).toBeTruthy();
        expect(region).toHaveAttribute("aria-labelledby", button.id);
        expect(region).toHaveAttribute("role", "region");
        expect(region).toHaveTextContent(items[0].children);
      }
    }
  });

  it("toggle accordion on mouse click", async () => {
    render(() => <Example />);

    const buttons = screen.getAllByRole("button");
    const selectedItem = buttons[0];

    expect(selectedItem).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(selectedItem);
    expect(selectedItem).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(selectedItem);
    expect(selectedItem).toHaveAttribute("aria-expanded", "true");
  });

  it("allows users to open and close accordion item with enter / space key", async () => {
    render(() => <Example />);

    const buttons = screen.getAllByRole("button");
    const selectedItem = buttons[0];

    expect(selectedItem).toHaveAttribute("aria-expanded", "true");

    selectedItem.focus();
    expect(document.activeElement).toBe(selectedItem);

    fireEvent.keyDown(selectedItem, { key: "Enter" });
    fireEvent.keyUp(selectedItem, { key: "Enter" });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-expanded", "false");

    fireEvent.keyDown(selectedItem, { key: "Enter" });
    fireEvent.keyUp(selectedItem, { key: "Enter" });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-expanded", "true");
  });

  it("allows users to navigate accordion headers through arrow keys", async () => {
    render(() => <Example />);

    const buttons = screen.getAllByRole("button");
    const [firstItem, secondItem, thirdItem] = buttons;

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);

    fireEvent.keyDown(firstItem, { key: "ArrowUp" });
    await Promise.resolve();
    expect(document.activeElement).toBe(firstItem);

    fireEvent.keyDown(firstItem, { key: "ArrowDown" });
    await Promise.resolve();
    expect(document.activeElement).toBe(secondItem);

    fireEvent.keyDown(secondItem, { key: "ArrowDown" });
    await Promise.resolve();
    expect(document.activeElement).toBe(thirdItem);

    fireEvent.keyDown(thirdItem, { key: "ArrowDown" });
    await Promise.resolve();
    expect(document.activeElement).toBe(thirdItem);

    fireEvent.keyDown(thirdItem, { key: "ArrowUp" });
    await Promise.resolve();
    expect(document.activeElement).toBe(secondItem);
  });

  it("allows users to navigate accordion headers through the tab key", async () => {
    render(() => <Example />);

    const buttons = screen.getAllByRole("button");
    const [firstItem, secondItem, thirdItem] = buttons;

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);

    await userEvent.tab();
    expect(document.activeElement).toBe(secondItem);

    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(firstItem);

    await userEvent.tab();
    expect(document.activeElement).toBe(secondItem);

    await userEvent.tab();
    expect(document.activeElement).toBe(thirdItem);

    await userEvent.tab();
    expect(document.activeElement).not.toBe(firstItem);
    expect(document.activeElement).not.toBe(secondItem);
    expect(document.activeElement).not.toBe(thirdItem);

    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(thirdItem);
  });
});
