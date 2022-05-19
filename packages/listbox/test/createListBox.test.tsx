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

import { fireEvent, render, screen } from "solid-testing-library";

import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  AriaListBoxSectionProps,
  createListBox,
  createListBoxOption,
  createListBoxSection
} from "../src";

function ListBox(props: AriaListBoxProps) {
  let ref: HTMLUListElement | undefined;

  const { ListBoxProvider, listBoxProps } = createListBox(props, () => ref);

  return (
    <ListBoxProvider>
      <ul {...listBoxProps()} ref={ref}>
        {props.children}
      </ul>
    </ListBoxProvider>
  );
}

function Section(props: AriaListBoxSectionProps) {
  const { groupProps, headingProps, itemProps } = createListBoxSection(props);

  return (
    <li {...itemProps()}>
      <span {...headingProps()}>{props.heading}</span>
      <ul {...groupProps()}>{props.children}</ul>
    </li>
  );
}

function Option(props: AriaListBoxOptionProps) {
  let ref: HTMLLIElement | undefined;

  const { optionProps } = createListBoxOption(props, () => ref);

  return (
    <li {...optionProps()} ref={ref}>
      {props.children}
    </li>
  );
}

describe("createListBox", () => {
  it("renders properly", () => {
    render(() => (
      <ListBox>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
      </ListBox>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    expect(listbox).toBeInTheDocument();

    expect(options.length).toBe(3);

    let i = 1;
    for (const option of options) {
      expect(option).toBeInTheDocument();
      expect(option).toHaveAttribute("tabindex");
      expect(option).not.toHaveAttribute("aria-selected");
      expect(option).not.toHaveAttribute("aria-disabled");
      expect(option).toHaveAttribute("aria-posinset", "" + i++);
      expect(option).toHaveAttribute("aria-setsize");
    }
  });

  it("allows user to change option focus via up/down arrow keys", async () => {
    render(() => (
      <ListBox>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
      </ListBox>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    fireEvent.focus(listbox);
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);

    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    await Promise.resolve();

    expect(document.activeElement).toBe(options[1]);

    fireEvent.keyDown(listbox, { key: "ArrowUp" });
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);
  });

  it("wraps focus from first to last/last to first item if up/down arrow is pressed if shouldFocusWrap is true", async () => {
    render(() => (
      <ListBox shouldFocusWrap>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
      </ListBox>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    fireEvent.focus(listbox);
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);

    fireEvent.keyDown(listbox, { key: "ArrowUp" });
    await Promise.resolve();

    expect(document.activeElement).toBe(options[2]);

    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);
  });

  describe("supports single selection", () => {
    it("supports defaultSelectedKeys (uncontrolled)", async () => {
      const defaultSelectedKeys = new Set(["2"]);

      render(() => (
        <ListBox selectionMode="single" defaultSelectedKeys={defaultSelectedKeys}>
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
          <Option value="3">Three</Option>
        </ListBox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");
      const selectedOption = options[1];

      fireEvent.focus(listbox);
      await Promise.resolve();

      expect(document.activeElement).toBe(selectedOption);
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
      expect(selectedOption).toHaveAttribute("tabindex", "0");
    });

    it("supports selectedKeys (controlled)", async () => {
      const selectedKeys = new Set(["2"]);
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <ListBox
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChangeSpy}
        >
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
          <Option value="3">Three</Option>
        </ListBox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");
      const selectedOption = options[1];

      fireEvent.focus(listbox);
      await Promise.resolve();

      expect(document.activeElement).toBe(selectedOption);
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
      expect(selectedOption).toHaveAttribute("tabindex", "0");

      const nextSelectedOption = options[2];

      // Try select a different option via enter
      fireEvent.keyDown(nextSelectedOption, { key: "Enter" });
      await Promise.resolve();

      // Since Listbox is controlled, selection doesn't change
      expect(nextSelectedOption).not.toHaveAttribute("aria-selected");
      expect(selectedOption).toHaveAttribute("aria-selected", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports using space key to change item selection", async () => {
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <ListBox selectionMode="single" onSelectionChange={onSelectionChangeSpy}>
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
          <Option value="3">Three</Option>
        </ListBox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      fireEvent.focus(listbox);
      await Promise.resolve();

      const nextSelectedOption = options[2];

      // Select an option via spacebar
      fireEvent.keyDown(nextSelectedOption, { key: " " });
      await Promise.resolve();

      expect(nextSelectedOption).toHaveAttribute("aria-selected", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports using click to change item selection", async () => {
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <ListBox selectionMode="single" onSelectionChange={onSelectionChangeSpy}>
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
          <Option value="3">Three</Option>
        </ListBox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      fireEvent.focus(listbox);
      await Promise.resolve();

      const nextSelectedOption = options[2];

      // Select an option via click
      fireEvent.click(nextSelectedOption);
      await Promise.resolve();

      expect(nextSelectedOption).toHaveAttribute("aria-selected", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports disabled options", async () => {
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <ListBox selectionMode="single" onSelectionChange={onSelectionChangeSpy}>
          <Option value="1">One</Option>
          <Option value="2" isDisabled>
            Two
          </Option>
          <Option value="3">Three</Option>
        </ListBox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      const disabledOption = options[1];

      expect(disabledOption).toHaveAttribute("aria-disabled", "true");

      // Try select the disabled option
      fireEvent.click(disabledOption);
      await Promise.resolve();

      // Verify onSelectionChange is not called
      expect(onSelectionChangeSpy).not.toHaveBeenCalled();

      fireEvent.focus(listbox);
      await Promise.resolve();

      expect(document.activeElement).toBe(options[0]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      // Verify that keyboard navigation skips the disabled option
      expect(document.activeElement).toBe(options[2]);
    });
  });

  describe("supports multi selection", () => {
    it("supports selecting multiple items", async () => {
      const onSelectionChangeSpy = jest.fn();

      render(() => (
        <ListBox selectionMode="multiple" onSelectionChange={onSelectionChangeSpy}>
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
          <Option value="3">Three</Option>
        </ListBox>
      ));

      const listbox = screen.getByRole("listbox");
      const options = screen.getAllByRole("option");

      expect(listbox).toHaveAttribute("aria-multiselectable", "true");

      fireEvent.click(options[0]);
      await Promise.resolve();

      fireEvent.click(options[2]);
      await Promise.resolve();

      expect(options[0]).toHaveAttribute("aria-selected", "true");
      expect(options[2]).toHaveAttribute("aria-selected", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(2);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("1")).toBeTruthy();
      expect(onSelectionChangeSpy.mock.calls[1][0].has("3")).toBeTruthy();
    });

    it("supports multiple defaultSelectedKeys (uncontrolled)", async () => {
      const onSelectionChangeSpy = jest.fn();

      const defaultSelectedKeys = new Set(["1", "2"]);

      render(() => (
        <ListBox
          selectionMode="multiple"
          defaultSelectedKeys={defaultSelectedKeys}
          onSelectionChange={onSelectionChangeSpy}
        >
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
          <Option value="3">Three</Option>
        </ListBox>
      ));

      const options = screen.getAllByRole("option");

      const firstOption = options[0];
      const secondOption = options[1];
      const thirdOption = options[2];

      expect(firstOption).toHaveAttribute("aria-selected", "true");
      expect(secondOption).toHaveAttribute("aria-selected", "true");

      // Select a different option
      fireEvent.click(thirdOption);
      await Promise.resolve();

      expect(thirdOption).toHaveAttribute("aria-selected", "true");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("1")).toBeTruthy();
      expect(onSelectionChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports multiple selectedKeys (controlled)", async () => {
      const onSelectionChangeSpy = jest.fn();

      const selectedKeys = new Set(["1", "2"]);

      render(() => (
        <ListBox
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChangeSpy}
        >
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
          <Option value="3">Three</Option>
        </ListBox>
      ));

      const options = screen.getAllByRole("option");

      const firstOption = options[0];
      const secondOption = options[1];
      const thirdOption = options[2];

      expect(firstOption).toHaveAttribute("aria-selected", "true");
      expect(secondOption).toHaveAttribute("aria-selected", "true");

      // Select a different option
      fireEvent.click(thirdOption);
      await Promise.resolve();

      expect(thirdOption).not.toHaveAttribute("aria-selected");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
    });

    it("supports deselection", async () => {
      const onSelectionChangeSpy = jest.fn();

      const defaultSelectedKeys = new Set(["1", "2"]);

      render(() => (
        <ListBox
          selectionMode="multiple"
          defaultSelectedKeys={defaultSelectedKeys}
          onSelectionChange={onSelectionChangeSpy}
        >
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
          <Option value="3">Three</Option>
        </ListBox>
      ));

      const options = screen.getAllByRole("option");

      const firstOption = options[0];
      const secondOption = options[1];

      expect(firstOption).toHaveAttribute("aria-selected", "true");
      expect(secondOption).toHaveAttribute("aria-selected", "true");

      // Deselect first option
      fireEvent.click(firstOption);
      await Promise.resolve();

      expect(firstOption).not.toHaveAttribute("aria-selected");

      expect(onSelectionChangeSpy).toBeCalledTimes(1);
      expect(onSelectionChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
    });

    it("supports disabled options", async () => {
      const onSelectionChangeSpy = jest.fn();

      const defaultSelectedKeys = new Set(["1", "2"]);

      render(() => (
        <ListBox
          selectionMode="multiple"
          defaultSelectedKeys={defaultSelectedKeys}
          onSelectionChange={onSelectionChangeSpy}
        >
          <Option value="1">One</Option>
          <Option value="2">Two</Option>
          <Option value="3" isDisabled>
            Three
          </Option>
        </ListBox>
      ));

      const options = screen.getAllByRole("option");

      const firstOption = options[0];
      const secondOption = options[1];
      const disabledOption = options[2];

      expect(disabledOption).toHaveAttribute("aria-disabled", "true");

      fireEvent.click(disabledOption);
      await Promise.resolve();

      expect(onSelectionChangeSpy).not.toHaveBeenCalled();

      expect(firstOption).toHaveAttribute("aria-selected", "true");
      expect(secondOption).toHaveAttribute("aria-selected", "true");
    });
  });

  it("supports empty selection when allowEmptySelection is true", async () => {
    const onSelectionChangeSpy = jest.fn();

    const defaultSelectedKeys = new Set(["2"]);

    render(() => (
      <ListBox
        selectionMode="single"
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChangeSpy}
        allowEmptySelection={true}
      >
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
      </ListBox>
    ));

    const options = screen.getAllByRole("option");

    const secondOption = options[1];

    expect(secondOption).toHaveAttribute("aria-selected", "true");

    // Deselect second option
    fireEvent.click(secondOption);
    await Promise.resolve();

    expect(secondOption).not.toHaveAttribute("aria-selected");

    expect(onSelectionChangeSpy).toBeCalledTimes(1);
    expect(onSelectionChangeSpy.mock.calls[0][0].size === 0).toBeTruthy();
  });

  it("supports type to select", async () => {
    // Since `createTypeSelect` use setTimeout internally, we need to fake it.
    jest.useFakeTimers();

    render(() => (
      <ListBox>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
      </ListBox>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    fireEvent.focus(listbox);
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);

    fireEvent.keyDown(listbox, { key: "T" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(options[1]);

    fireEvent.keyDown(listbox, { key: "T" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(options[2]);

    fireEvent.keyDown(listbox, { key: "O" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);
  });

  it("resets the search text after a timeout", async () => {
    // Since `createTypeSelect` use setTimeout internally, we need to fake it.
    jest.useFakeTimers();

    render(() => (
      <ListBox>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
      </ListBox>
    ));

    const listbox = screen.getByRole("listbox");
    const options = screen.getAllByRole("option");

    fireEvent.focus(listbox);
    await Promise.resolve();

    fireEvent.keyDown(listbox, { key: "O" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);

    fireEvent.keyDown(listbox, { key: "O" });
    jest.runAllTimers();
    await Promise.resolve();

    expect(document.activeElement).toBe(options[0]);
  });

  it("supports aria-label", () => {
    render(() => (
      <ListBox aria-label="Test">
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
      </ListBox>
    ));

    const listbox = screen.getByRole("listbox");

    expect(listbox).toHaveAttribute("aria-label", "Test");
  });

  it("supports aria-label on sections and options", () => {
    render(() => (
      <ListBox aria-label="ListBox">
        <Section aria-label="Section">
          <Option aria-label="Option" value="1">
            One
          </Option>
        </Section>
      </ListBox>
    ));

    const listbox = screen.getByRole("listbox");
    const section = screen.getByRole("group");
    const option = screen.getByRole("option");

    expect(listbox).toHaveAttribute("aria-label", "ListBox");

    expect(section).toHaveAttribute("aria-label", "Section");

    expect(option).toHaveAttribute("aria-label", "Option");
    expect(option).not.toHaveAttribute("aria-labelledby");
    expect(option).not.toHaveAttribute("aria-describedby");
  });

  it("supports custom data attributes", () => {
    render(() => (
      <ListBox data-testid="Test">
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
      </ListBox>
    ));

    const listbox = screen.getByRole("listbox");

    expect(listbox).toHaveAttribute("data-testid", "Test");
  });
});
