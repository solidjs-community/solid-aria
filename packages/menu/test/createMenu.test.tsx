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
import { ParentProps } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { AriaMenuItemProps, AriaMenuProps, createMenu, createMenuItem } from "../src";

function MenuItem(props: ParentProps<AriaMenuItemProps>) {
  let ref: HTMLLIElement | undefined;

  const { menuItemProps } = createMenuItem(props, () => ref);

  return (
    <li {...menuItemProps} ref={ref}>
      {props.children}
    </li>
  );
}

function Menu(props: AriaMenuProps) {
  let ref: HTMLUListElement | undefined;

  const { MenuProvider, menuProps, state } = createMenu(props, () => ref);

  return (
    <MenuProvider>
      <ul {...menuProps} ref={ref}>
        <ForItems in={state.collection()}>
          {item => (
            <MenuItem
              aria-label={item()["aria-label"]()}
              key={item().key}
              onAction={props.onAction}
            >
              {item().rendered()}
            </MenuItem>
          )}
        </ForItems>
      </ul>
    </MenuProvider>
  );
}

describe("createMenu", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.requestAnimationFrame.mockRestore();
    jest.clearAllTimers();
  });

  it("renders properly", () => {
    render(() => (
      <Menu aria-label="menu">
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menu = screen.getByRole("menu");
    const menuItems = screen.getAllByRole("menuitem");

    expect(menu).toBeInTheDocument();

    expect(menuItems.length).toBe(3);

    for (const menuItem of menuItems) {
      expect(menuItem).toBeInTheDocument();
      expect(menuItem).toHaveAttribute("tabindex");
      expect(menuItem).toHaveAttribute("aria-disabled", "false");
    }
  });

  it("allows user to change menu item focus via up/down arrow keys", async () => {
    render(() => (
      <Menu aria-label="menu">
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menu = screen.getByRole("menu");
    const menuItems = screen.getAllByRole("menuitem");

    fireEvent.focusIn(menu);
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[0]);

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[1]);

    fireEvent.keyDown(menu, { key: "ArrowUp" });
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[0]);
  });

  it("wraps focus from first to last/last to first item if up/down arrow is pressed if shouldFocusWrap is true", async () => {
    render(() => (
      <Menu aria-label="menu" shouldFocusWrap>
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menu = screen.getByRole("menu");
    const menuItems = screen.getAllByRole("menuitem");

    fireEvent.focusIn(menu);
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[0]);

    fireEvent.keyDown(menu, { key: "ArrowUp" });
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[2]);

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[0]);
  });

  describe("supports single selection", () => {
    it("supports defaultSelectedKeys (uncontrolled)", async () => {
      const defaultSelectedKeys = new Set(["2"]);

      render(() => (
        <Menu aria-label="menu" selectionMode="single" defaultSelectedKeys={defaultSelectedKeys}>
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menu = screen.getByRole("menu");
      const menuItems = screen.getAllByRole("menuitemradio");
      const selectedOption = menuItems[1];

      fireEvent.focusIn(menu);
      await Promise.resolve();

      expect(document.activeElement).toBe(selectedOption);
      expect(selectedOption).toHaveAttribute("aria-checked", "true");
      expect(selectedOption).toHaveAttribute("tabindex", "0");
    });

    it("supports selectedKeys (controlled)", async () => {
      const selectedKeys = new Set(["2"]);
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <Menu
          aria-label="menu"
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChangeSpy}
        >
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menu = screen.getByRole("menu");
      const menuItems = screen.getAllByRole("menuitemradio");
      const selectedOption = menuItems[1];

      fireEvent.focusIn(menu);
      await Promise.resolve();

      expect(document.activeElement).toBe(selectedOption);
      expect(selectedOption).toHaveAttribute("aria-checked", "true");
      expect(selectedOption).toHaveAttribute("tabindex", "0");

      const nextSelectedOption = menuItems[2];

      // Try select a different option via enter
      fireEvent.keyDown(nextSelectedOption, { key: "Enter" });
      await Promise.resolve();

      // Since Listbox is controlled, selection doesn't change
      expect(nextSelectedOption).toHaveAttribute("aria-checked", "false");
      expect(selectedOption).toHaveAttribute("aria-checked", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports using space key to change item selection", async () => {
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <Menu aria-label="menu" selectionMode="single" onSelectionChange={onSelectionChangeSpy}>
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menu = screen.getByRole("menu");
      const menuItems = screen.getAllByRole("menuitemradio");

      fireEvent.focusIn(menu);
      await Promise.resolve();

      const nextSelectedOption = menuItems[2];

      // Select an option via spacebar
      fireEvent.keyDown(nextSelectedOption, { key: " " });
      await Promise.resolve();

      expect(nextSelectedOption).toHaveAttribute("aria-checked", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports using click to change item selection", async () => {
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <Menu aria-label="menu" selectionMode="single" onSelectionChange={onSelectionChangeSpy}>
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menu = screen.getByRole("menu");
      const menuItems = screen.getAllByRole("menuitemradio");

      fireEvent.focusIn(menu);
      await Promise.resolve();

      const nextSelectedOption = menuItems[2];

      // Select an option via click
      fireEvent.click(nextSelectedOption);
      await Promise.resolve();

      expect(nextSelectedOption).toHaveAttribute("aria-checked", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports disabled menu items", async () => {
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <Menu
          aria-label="menu"
          selectionMode="single"
          onSelectionChange={onSelectionChangeSpy}
          disabledKeys={["2"]}
        >
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menu = screen.getByRole("menu");
      const menuItems = screen.getAllByRole("menuitemradio");

      const disabledOption = menuItems[1];

      expect(disabledOption).toHaveAttribute("aria-disabled", "true");

      // Try select the disabled option
      fireEvent.click(disabledOption);
      await Promise.resolve();

      // Verify onSelectionChange is not called
      expect(onSelectionChangeSpy).not.toHaveBeenCalled();

      fireEvent.focusIn(menu);
      await Promise.resolve();

      expect(document.activeElement).toBe(menuItems[0]);

      fireEvent.keyDown(menu, { key: "ArrowDown" });
      await Promise.resolve();

      // Verify that keyboard navigation skips the disabled option
      expect(document.activeElement).toBe(menuItems[2]);
    });
  });

  describe("supports multi selection", () => {
    it("supports selecting multiple items", async () => {
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <Menu aria-label="menu" selectionMode="multiple" onSelectionChange={onSelectionChangeSpy}>
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menuItems = screen.getAllByRole("menuitemcheckbox");

      fireEvent.click(menuItems[0]);
      await Promise.resolve();

      fireEvent.click(menuItems[2]);
      await Promise.resolve();

      expect(menuItems[0]).toHaveAttribute("aria-checked", "true");
      expect(menuItems[2]).toHaveAttribute("aria-checked", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(2);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("1")).toBeTruthy();
      expect(onSelectionChangeSpy.mock.calls[1][0].has("3")).toBeTruthy();
    });

    it("supports multiple defaultSelectedKeys (uncontrolled)", async () => {
      const onSelectionChangeSpy = jest.fn();

      const defaultSelectedKeys = new Set(["1", "2"]);

      render(() => (
        <Menu
          aria-label="menu"
          selectionMode="multiple"
          defaultSelectedKeys={defaultSelectedKeys}
          onSelectionChange={onSelectionChangeSpy}
        >
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menuItems = screen.getAllByRole("menuitemcheckbox");

      const firstOption = menuItems[0];
      const secondOption = menuItems[1];
      const thirdOption = menuItems[2];

      expect(firstOption).toHaveAttribute("aria-checked", "true");
      expect(secondOption).toHaveAttribute("aria-checked", "true");

      // Select a different option
      fireEvent.click(thirdOption);
      await Promise.resolve();

      expect(thirdOption).toHaveAttribute("aria-checked", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("1")).toBeTruthy();
      expect(onSelectionChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports multiple selectedKeys (controlled)", async () => {
      const onSelectionChangeSpy = jest.fn();

      const selectedKeys = new Set(["1", "2"]);

      render(() => (
        <Menu
          aria-label="menu"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChangeSpy}
        >
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menuItems = screen.getAllByRole("menuitemcheckbox");

      const firstOption = menuItems[0];
      const secondOption = menuItems[1];
      const thirdOption = menuItems[2];

      expect(firstOption).toHaveAttribute("aria-checked", "true");
      expect(secondOption).toHaveAttribute("aria-checked", "true");

      // Select a different option
      fireEvent.click(thirdOption);
      await Promise.resolve();

      expect(thirdOption).toHaveAttribute("aria-checked", "false");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports deselection", async () => {
      const onSelectionChangeSpy = jest.fn();

      const defaultSelectedKeys = new Set(["1", "2"]);

      render(() => (
        <Menu
          aria-label="menu"
          selectionMode="multiple"
          defaultSelectedKeys={defaultSelectedKeys}
          onSelectionChange={onSelectionChangeSpy}
        >
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menuItems = screen.getAllByRole("menuitemcheckbox");

      const firstOption = menuItems[0];
      const secondOption = menuItems[1];

      expect(firstOption).toHaveAttribute("aria-checked", "true");
      expect(secondOption).toHaveAttribute("aria-checked", "true");

      // Deselect first option
      fireEvent.click(firstOption);
      await Promise.resolve();

      expect(firstOption).toHaveAttribute("aria-checked", "false");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
    });

    it("supports disabled menu items", async () => {
      const onSelectionChangeSpy = jest.fn();

      const defaultSelectedKeys = new Set(["1", "2"]);

      render(() => (
        <Menu
          aria-label="menu"
          selectionMode="multiple"
          defaultSelectedKeys={defaultSelectedKeys}
          onSelectionChange={onSelectionChangeSpy}
          disabledKeys={["3"]}
        >
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Menu>
      ));

      const menuItems = screen.getAllByRole("menuitemcheckbox");

      const firstOption = menuItems[0];
      const secondOption = menuItems[1];
      const disabledOption = menuItems[2];

      expect(disabledOption).toHaveAttribute("aria-disabled", "true");

      fireEvent.click(disabledOption);
      await Promise.resolve();

      expect(onSelectionChangeSpy).not.toHaveBeenCalled();

      expect(firstOption).toHaveAttribute("aria-checked", "true");
      expect(secondOption).toHaveAttribute("aria-checked", "true");
    });
  });

  it("supports empty selection when disallowEmptySelection is false", async () => {
    const onSelectionChangeSpy = jest.fn();

    const defaultSelectedKeys = new Set(["2"]);

    render(() => (
      <Menu
        aria-label="menu"
        selectionMode="single"
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChangeSpy}
        disallowEmptySelection={false}
      >
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menuItems = screen.getAllByRole("menuitemradio");

    const secondOption = menuItems[1];

    expect(secondOption).toHaveAttribute("aria-checked", "true");

    // Deselect second option
    fireEvent.click(secondOption);
    await Promise.resolve();

    expect(secondOption).toHaveAttribute("aria-checked", "false");

    expect(onSelectionChangeSpy).toBeCalledTimes(1);
    expect(onSelectionChangeSpy.mock.calls[0][0].size === 0).toBeTruthy();
  });

  it("supports no selection", async () => {
    render(() => (
      <Menu aria-label="menu" selectionMode="none">
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menuItems = screen.getAllByRole("menuitem");

    // Attempt to select a variety of items via enter, space, and click
    fireEvent.click(menuItems[0]);
    await Promise.resolve();

    fireEvent.keyDown(menuItems[1], { key: " ", code: 32, charCode: 32 });
    await Promise.resolve();

    fireEvent.keyDown(menuItems[2], { key: "Enter", code: 13, charCode: 13 });
    await Promise.resolve();

    for (const menuItem of menuItems) {
      expect(menuItem).not.toHaveAttribute("aria-checked");
    }
  });

  it("supports type to select", async () => {
    render(() => (
      <Menu aria-label="menu">
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menu = screen.getByRole("menu");
    const menuItems = screen.getAllByRole("menuitem");

    fireEvent.focusIn(menu);
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[0]);

    fireEvent.keyDown(menu, { key: "T" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[1]);

    fireEvent.keyDown(menu, { key: "O" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[0]);
  });

  it("resets the search text after a timeout", async () => {
    render(() => (
      <Menu aria-label="menu">
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menu = screen.getByRole("menu");
    const menuItems = screen.getAllByRole("menuitem");

    fireEvent.focusIn(menu);
    await Promise.resolve();

    fireEvent.keyDown(menu, { key: "O" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[0]);

    fireEvent.keyDown(menu, { key: "O" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(menuItems[0]);
  });

  it("supports actions", async () => {
    const onActionSpy = jest.fn();
    const onSelectionChangeSpy = jest.fn();

    render(() => (
      <Menu aria-label="menu" onSelectionChange={onSelectionChangeSpy} onAction={onActionSpy}>
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menuItems = screen.getAllByRole("menuitem");

    fireEvent.click(menuItems[0]);
    await Promise.resolve();

    expect(onActionSpy).toHaveBeenCalledWith("1");
    expect(onSelectionChangeSpy).toHaveBeenCalledTimes(0);

    fireEvent.click(menuItems[1]);
    await Promise.resolve();

    expect(onActionSpy).toHaveBeenCalledWith("2");
    expect(onSelectionChangeSpy).toHaveBeenCalledTimes(0);

    fireEvent.click(menuItems[2]);
    await Promise.resolve();

    expect(onActionSpy).toHaveBeenCalledWith("3");
    expect(onSelectionChangeSpy).toHaveBeenCalledTimes(0);
  });

  it("supports aria-label on items", function () {
    render(() => (
      <Menu aria-label="menu">
        <Item key="item" aria-label="Item">
          Item
        </Item>
      </Menu>
    ));

    const menuItem = screen.getByRole("menuitem");

    expect(menuItem).toHaveAttribute("aria-label", "Item");
    expect(menuItem).not.toHaveAttribute("aria-labelledby");
    expect(menuItem).not.toHaveAttribute("aria-describedby");
  });

  it("supports aria-label", () => {
    render(() => (
      <Menu aria-label="Test">
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menu = screen.getByRole("menu");

    expect(menu).toHaveAttribute("aria-label", "Test");
  });

  it("warns user if no aria-label is provided", () => {
    const spyWarn = jest.spyOn(console, "warn").mockImplementation(() => {
      return;
    });

    render(() => (
      <Menu>
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    expect(spyWarn).toHaveBeenCalledWith(
      "An aria-label or aria-labelledby prop is required for accessibility."
    );
  });

  it("supports custom data attributes", () => {
    render(() => (
      <Menu aria-label="menu" data-testid="Test">
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    ));

    const menu = screen.getByRole("menu");

    expect(menu).toHaveAttribute("data-testid", "Test");
  });
});
