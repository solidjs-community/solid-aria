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
  AriaCheckboxGroupItemProps,
  AriaCheckboxGroupProps,
  createCheckboxGroup,
  createCheckboxGroupItem
} from "../src";

function CheckboxGroup(props: AriaCheckboxGroupProps) {
  const { CheckboxGroupProvider, groupProps, labelProps } = createCheckboxGroup(props);

  return (
    <div {...groupProps}>
      <span {...labelProps}>{props.label}</span>
      <CheckboxGroupProvider>{props.children}</CheckboxGroupProvider>
    </div>
  );
}

function Checkbox(props: AriaCheckboxGroupItemProps) {
  let ref: HTMLInputElement | undefined;

  const { inputProps } = createCheckboxGroupItem(props, () => ref);

  return (
    <label>
      <input ref={ref} {...inputProps} />
      {props.children}
    </label>
  );
}

describe("createCheckboxGroup", () => {
  it("handles defaults", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <CheckboxGroup label="Favorite Pet" onChange={onChangeSpy}>
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    ));

    const checkboxGroup = screen.getByRole("group", { exact: true });
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(checkboxGroup).toBeInTheDocument();
    expect(checkboxes.length).toBe(3);

    expect(checkboxes[0]).not.toHaveAttribute("name");
    expect(checkboxes[1]).not.toHaveAttribute("name");
    expect(checkboxes[2]).not.toHaveAttribute("name");

    expect(checkboxes[0].value).toBe("dogs");
    expect(checkboxes[1].value).toBe("cats");
    expect(checkboxes[2].value).toBe("dragons");

    expect(checkboxes[0].checked).toBeFalsy();
    expect(checkboxes[1].checked).toBeFalsy();
    expect(checkboxes[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(["dragons"]);

    expect(checkboxes[0].checked).toBeFalsy();
    expect(checkboxes[1].checked).toBeFalsy();
    expect(checkboxes[2].checked).toBeTruthy();
  });

  it("can have a default value", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <CheckboxGroup label="Favorite Pet" defaultValue={["cats"]} onChange={onChangeSpy}>
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    ));

    const checkboxGroup = screen.getByRole("group", { exact: true });
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(checkboxGroup).toBeTruthy();
    expect(checkboxes.length).toBe(3);
    expect(onChangeSpy).not.toHaveBeenCalled();

    expect(checkboxes[0].checked).toBeFalsy();
    expect(checkboxes[1].checked).toBeTruthy();
    expect(checkboxes[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(["cats", "dragons"]);

    expect(checkboxes[0].checked).toBeFalsy();
    expect(checkboxes[1].checked).toBeTruthy();
    expect(checkboxes[2].checked).toBeTruthy();
  });

  it("value can be controlled", async () => {
    const onChangeSpy = jest.fn();
    render(() => (
      <CheckboxGroup label="Favorite Pet" value={["cats"]} onChange={onChangeSpy}>
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    ));

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(checkboxes[0].checked).toBeFalsy();
    expect(checkboxes[1].checked).toBeTruthy();
    expect(checkboxes[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(["cats", "dragons"]);

    expect(checkboxes[0].checked).toBeFalsy();
    expect(checkboxes[1].checked).toBeTruthy();

    // false because `value` is controlled
    expect(checkboxes[2].checked).toBeFalsy();
  });

  it("name can be controlled", () => {
    render(() => (
      <CheckboxGroup label="Favorite Pet" name="test-name">
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    ));

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(checkboxes[0]).toHaveAttribute("name", "test-name");
    expect(checkboxes[1]).toHaveAttribute("name", "test-name");
    expect(checkboxes[2]).toHaveAttribute("name", "test-name");
  });

  it("supports labeling", () => {
    render(() => (
      <CheckboxGroup label="Favorite Pet">
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    ));

    const checkboxGroup = screen.getByRole("group", { exact: true });

    const labelId = checkboxGroup.getAttribute("aria-labelledby");

    expect(labelId).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const label = document.getElementById(labelId!);

    expect(label).toHaveTextContent("Favorite Pet");
  });

  it("supports aria-label", () => {
    render(() => (
      <CheckboxGroup aria-label="My Favorite Pet">
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    ));

    const checkboxGroup = screen.getByRole("group", { exact: true });

    expect(checkboxGroup).toHaveAttribute("aria-label", "My Favorite Pet");
  });

  it("supports custom props", () => {
    render(() => (
      <CheckboxGroup label="Favorite Pet" data-testid="favorite-pet">
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    ));

    const checkboxGroup = screen.getByRole("group", { exact: true });

    expect(checkboxGroup).toHaveAttribute("data-testid", "favorite-pet");
  });

  it("sets aria-disabled and makes checkboxes disabled when isDisabled is true", async () => {
    const groupOnChangeSpy = jest.fn();
    const checkboxOnChangeSpy = jest.fn();

    render(() => (
      <CheckboxGroup label="Favorite Pet" isDisabled onChange={groupOnChangeSpy}>
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons" onChange={checkboxOnChangeSpy}>
          Dragons
        </Checkbox>
      </CheckboxGroup>
    ));

    const checkboxGroup = screen.getByRole("group", { exact: true });

    expect(checkboxGroup).toHaveAttribute("aria-disabled", "true");

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(checkboxes[0]).toHaveAttribute("disabled");
    expect(checkboxes[1]).toHaveAttribute("disabled");
    expect(checkboxes[2]).toHaveAttribute("disabled");

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(checkboxOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(checkboxes[2].checked).toBeFalsy();
  });

  it("doesn't set aria-disabled or make checkboxes disabled by default", () => {
    render(() => (
      <CheckboxGroup label="Favorite Pet">
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    ));

    const checkboxGroup = screen.getByRole("group", { exact: true });

    expect(checkboxGroup).not.toHaveAttribute("aria-disabled");

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(checkboxes[0]).not.toHaveAttribute("disabled");
    expect(checkboxes[1]).not.toHaveAttribute("disabled");
    expect(checkboxes[2]).not.toHaveAttribute("disabled");
  });

  it("doesn't set aria-disabled or make checkboxes disabled when isDisabled is false", () => {
    render(() => (
      <CheckboxGroup label="Favorite Pet" isDisabled={false}>
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    ));

    const checkboxGroup = screen.getByRole("group", { exact: true });

    expect(checkboxGroup).not.toHaveAttribute("aria-disabled");

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(checkboxes[0]).not.toHaveAttribute("disabled");
    expect(checkboxes[1]).not.toHaveAttribute("disabled");
    expect(checkboxes[2]).not.toHaveAttribute("disabled");
  });

  it('sets aria-readonly="true" on each checkbox', async () => {
    const groupOnChangeSpy = jest.fn();
    const checkboxOnChangeSpy = jest.fn();

    render(() => (
      <CheckboxGroup label="Favorite Pet" isReadOnly onChange={groupOnChangeSpy}>
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons" onChange={checkboxOnChangeSpy}>
          Dragons
        </Checkbox>
      </CheckboxGroup>
    ));

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

    expect(checkboxes[0]).toHaveAttribute("aria-readonly", "true");
    expect(checkboxes[1]).toHaveAttribute("aria-readonly", "true");
    expect(checkboxes[2]).toHaveAttribute("aria-readonly", "true");
    expect(checkboxes[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(checkboxOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(checkboxes[2].checked).toBeFalsy();
  });

  it("should not update state for readonly checkbox", async () => {
    const groupOnChangeSpy = jest.fn();
    const checkboxOnChangeSpy = jest.fn();

    render(() => (
      <CheckboxGroup label="Favorite Pet" onChange={groupOnChangeSpy}>
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons" isReadOnly onChange={checkboxOnChangeSpy}>
          Dragons
        </Checkbox>
      </CheckboxGroup>
    ));

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(checkboxOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(checkboxes[2].checked).toBeFalsy();
  });
});
