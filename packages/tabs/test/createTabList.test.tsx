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
import { fireEvent, waitFor, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { For } from "solid-js";
import { render, screen } from "solid-testing-library";

import {
  AriaTabListProps,
  AriaTabPanelProps,
  AriaTabProps,
  createTab,
  createTabList,
  createTabPanel,
  useTabListContext
} from "../src";

function Tabs(props: AriaTabListProps) {
  let ref: HTMLDivElement | undefined;

  const { TabListProvider, state, tabListProps } = createTabList(props, () => ref);

  return (
    <TabListProvider>
      <div>
        <div {...tabListProps} ref={ref}>
          <ForItems in={state.collection()}>{item => <Tab item={item()} />}</ForItems>
        </div>
        <TabPanel />
      </div>
    </TabListProvider>
  );
}

function Tab(props: AriaTabProps) {
  let ref: HTMLDivElement | undefined;

  const { tabProps } = createTab(props, () => ref);

  return (
    <div {...tabProps} ref={ref}>
      {props.item.title}
    </div>
  );
}

function TabPanel(props: AriaTabPanelProps) {
  let ref: HTMLDivElement | undefined;

  const { state } = useTabListContext();

  const { tabPanelProps } = createTabPanel(props, () => ref);

  return (
    <div {...tabPanelProps} ref={ref}>
      {state.selectedItem()?.children}
    </div>
  );
}

const defaultItems = [
  { name: "Tab 1", children: "Tab 1 body" },
  { name: "", children: "Tab 2 body" },
  { name: "Tab 3", children: "Tab 3 body" }
];

describe("createTabList", () => {
  const onSelectionChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    jest.runAllTimers();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it("should renders properly", () => {
    render(() => (
      <Tabs>
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    const tablist = screen.getByRole("tablist");

    expect(tablist).toBeTruthy();

    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");

    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs.length).toBe(3);

    for (const tab of tabs) {
      expect(tab).toHaveAttribute("tabindex");
      expect(tab).toHaveAttribute("aria-selected");
      const isSelected = tab.getAttribute("aria-selected") === "true";

      if (isSelected) {
        expect(tab).toHaveAttribute("aria-controls");
        const tabpanel = document.getElementById(tab.getAttribute("aria-controls")!);
        expect(tabpanel).toBeTruthy();
        expect(tabpanel).toHaveAttribute("aria-labelledby", tab.id);
        expect(tabpanel).toHaveAttribute("role", "tabpanel");
        expect(tabpanel).toHaveTextContent(defaultItems[0].children);
      }
    }
  });

  it("should allows user to change tab item select via left/right arrow keys with horizontal tabs", async () => {
    render(() => (
      <Tabs orientation="horizontal">
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const selectedItem = tabs[0];

    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");
    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    selectedItem.focus();

    fireEvent.keyDown(selectedItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    const nextSelectedItem = tabs[1];
    expect(nextSelectedItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(nextSelectedItem, { key: "ArrowLeft", code: 37, charCode: 37 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    /** Doesn't change selection because its horizontal tabs. */
    fireEvent.keyDown(selectedItem, { key: "ArrowUp", code: 38, charCode: 38 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(selectedItem, { key: "ArrowDown", code: 40, charCode: 40 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");
  });

  it("should allows user to change tab item select via up/down arrow keys with vertical tabs", async () => {
    render(() => (
      <Tabs orientation="vertical">
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const selectedItem = tabs[0];

    selectedItem.focus();

    expect(tablist).toHaveAttribute("aria-orientation", "vertical");

    /** Doesn't change selection because it's vertical tabs. */
    expect(selectedItem).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(selectedItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(selectedItem, { key: "ArrowLeft", code: 37, charCode: 37 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");

    const nextSelectedItem = tabs[1];

    fireEvent.keyDown(selectedItem, { key: "ArrowDown", code: 40, charCode: 40 });
    await Promise.resolve();

    expect(nextSelectedItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(nextSelectedItem, { key: "ArrowUp", code: 38, charCode: 38 });
    await Promise.resolve();

    expect(selectedItem).toHaveAttribute("aria-selected", "true");
  });

  it("should wraps focus from first to last/last to first item", async () => {
    render(() => (
      <Tabs orientation="horizontal">
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];

    firstItem.focus();

    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");
    expect(firstItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(firstItem, { key: "ArrowLeft", code: 37, charCode: 37 });
    await Promise.resolve();

    const lastItem = tabs[tabs.length - 1];
    expect(lastItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(lastItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    expect(firstItem).toHaveAttribute("aria-selected", "true");
  });

  it("select last item via end key / select first item via home key", async () => {
    render(() => (
      <Tabs orientation="horizontal">
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];

    firstItem.focus();

    expect(firstItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(firstItem, { key: "End", code: 35, charCode: 35 });
    await Promise.resolve();

    const lastItem = tabs[tabs.length - 1];

    expect(lastItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(lastItem, { key: "Home", code: 36, charCode: 36 });
    await Promise.resolve();

    expect(firstItem).toHaveAttribute("aria-selected", "true");
  });

  it("should not select via left / right keys when keyboardActivation is manual, select on enter / spacebar", async () => {
    render(() => (
      <Tabs
        keyboardActivation="manual"
        defaultSelectedKey={defaultItems[0].name}
        onSelectionChange={onSelectionChange}
      >
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];
    const secondItem = tabs[1];
    const thirdItem = tabs[2];

    firstItem.focus();

    expect(firstItem).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(firstItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    expect(secondItem).toHaveAttribute("aria-selected", "false");
    expect(document.activeElement).toBe(secondItem);

    fireEvent.keyDown(secondItem, { key: "ArrowRight", code: 39, charCode: 39 });
    await Promise.resolve();

    expect(thirdItem).toHaveAttribute("aria-selected", "false");
    expect(document.activeElement).toBe(thirdItem);

    fireEvent.keyDown(thirdItem, { key: "Enter", code: 13, charCode: 13 });
    await Promise.resolve();

    expect(firstItem).toHaveAttribute("aria-selected", "false");
    expect(secondItem).toHaveAttribute("aria-selected", "false");
    expect(thirdItem).toHaveAttribute("aria-selected", "true");
    expect(onSelectionChange).toBeCalledTimes(1);
  });

  it("should supports using click to change tab", async () => {
    render(() => (
      <Tabs
        keyboardActivation="manual"
        defaultSelectedKey={defaultItems[0].name}
        onSelectionChange={onSelectionChange}
      >
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];

    expect(firstItem).toHaveAttribute("aria-selected", "true");

    const secondItem = tabs[1];

    fireEvent.click(secondItem);
    await Promise.resolve();

    expect(secondItem).toHaveAttribute("aria-selected", "true");
    expect(secondItem).toHaveAttribute("aria-controls");

    const tabpanel = document.getElementById(secondItem.getAttribute("aria-controls")!);

    expect(tabpanel).toBeTruthy();
    expect(tabpanel).toHaveAttribute("aria-labelledby", secondItem.id);
    expect(tabpanel).toHaveAttribute("role", "tabpanel");
    expect(tabpanel).toHaveTextContent(defaultItems[1].children);
    expect(onSelectionChange).toBeCalledTimes(1);
  });

  it("does not generate conflicting ids between multiple tabs instances", () => {
    render(() => (
      <>
        <Tabs>
          <For each={defaultItems}>
            {item => (
              <Item key={item.name} title={item.name}>
                {item.children}
              </Item>
            )}
          </For>
        </Tabs>
        <Tabs>
          <For each={defaultItems}>
            {item => (
              <Item key={item.name} title={item.name}>
                {item.children}
              </Item>
            )}
          </For>
        </Tabs>
      </>
    ));

    const tablists = screen.getAllByRole("tablist");
    const tabs1 = within(tablists[0]).getAllByRole("tab");
    const tabs2 = within(tablists[1]).getAllByRole("tab");

    for (let i = 0; i < tabs1.length; i++) {
      expect(tabs1[i].id).not.toBe(tabs2[i].id);
    }
  });

  it("should focus the selected tab when tabbing in for the first time", async () => {
    render(() => (
      <Tabs defaultSelectedKey={defaultItems[1].name}>
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    await userEvent.tab();

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");

    expect(document.activeElement).toBe(tabs[1]);
  });

  it("should not focus any tabs when isDisabled tabbing in for the first time", async () => {
    render(() => (
      <Tabs defaultSelectedKey={defaultItems[1].name} isDisabled>
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    await userEvent.tab();

    const tabpanel = screen.getByRole("tabpanel");

    expect(document.activeElement).toBe(tabpanel);
  });

  it("should not allow keyboard navigation on disabled tabs", async () => {
    render(() => (
      <Tabs
        defaultSelectedKey={defaultItems[0].name}
        disabledKeys={[defaultItems[1].name]}
        onSelectionChange={onSelectionChange}
      >
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    await userEvent.tab();

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");

    expect(document.activeElement).toBe(tabs[0]);

    fireEvent.keyDown(tabs[1], { key: "ArrowRight" });
    await Promise.resolve();

    fireEvent.keyUp(tabs[1], { key: "ArrowRight" });
    await Promise.resolve();

    expect(onSelectionChange).toBeCalledWith(defaultItems[2].name);
  });

  it("should not allow press on disabled tabs", async () => {
    render(() => (
      <Tabs
        defaultSelectedKey={defaultItems[0].name}
        disabledKeys={[defaultItems[1].name]}
        onSelectionChange={onSelectionChange}
      >
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    await userEvent.tab();

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");

    expect(document.activeElement).toBe(tabs[0]);

    await userEvent.click(tabs[1]);

    expect(onSelectionChange).not.toBeCalled();
  });

  it("should selects first tab When all tabs are disabled", async () => {
    render(() => (
      <Tabs
        disabledKeys={defaultItems.map(item => item.name)}
        onSelectionChange={onSelectionChange}
      >
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    await userEvent.tab();

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const tabpanel = screen.getByRole("tabpanel");

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(onSelectionChange).toBeCalledWith(defaultItems[0].name);
    expect(document.activeElement).toBe(tabpanel);
  });

  it("should set 'tabIndex=0' on tabpanel only when there are no focusable elements", async () => {
    render(() => (
      <Tabs>
        <Item key="one" title="Tab 1">
          <input />
        </Item>
        <Item key="two" title="Tab 2">
          <input disabled />
        </Item>
      </Tabs>
    ));

    let tabpanel = screen.getByRole("tabpanel");
    await waitFor(() => expect(tabpanel).not.toHaveAttribute("tabindex"));

    const tabs = screen.getAllByRole("tab");

    fireEvent.click(tabs[1]);
    await Promise.resolve();

    tabpanel = screen.getByRole("tabpanel");

    await waitFor(() => expect(tabpanel).toHaveAttribute("tabindex", "0"));

    fireEvent.click(tabs[0]);
    await Promise.resolve();

    tabpanel = screen.getByRole("tabpanel");

    await waitFor(() => expect(tabpanel).not.toHaveAttribute("tabindex"));
  });

  it("should fires onSelectionChange when clicking on the current tab", async () => {
    render(() => (
      <Tabs defaultSelectedKey={defaultItems[0].name} onSelectionChange={onSelectionChange}>
        <For each={defaultItems}>
          {item => (
            <Item key={item.name} title={item.name}>
              {item.children}
            </Item>
          )}
        </For>
      </Tabs>
    ));

    const tablist = screen.getByRole("tablist");
    const tabs = within(tablist).getAllByRole("tab");
    const firstItem = tabs[0];

    expect(firstItem).toHaveAttribute("aria-selected", "true");

    fireEvent.click(firstItem);
    await Promise.resolve();

    expect(onSelectionChange).toBeCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith(defaultItems[0].name);
  });
});
