import { fireEvent, render, screen } from "solid-testing-library";

import { AriaRadioGroupProps, AriaRadioProps, createRadio, createRadioGroup } from "../src";

function RadioGroup(props: AriaRadioGroupProps) {
  const { RadioGroupProvider, groupProps, labelProps } = createRadioGroup(props);

  return (
    <div {...groupProps()}>
      <span {...labelProps()}>{props.label}</span>
      <RadioGroupProvider>{props.children}</RadioGroupProvider>
    </div>
  );
}

function Radio(props: AriaRadioProps) {
  let ref: HTMLInputElement | undefined;

  const { inputProps } = createRadio(props, () => ref);

  return (
    <label>
      <input ref={ref} {...inputProps()} />
      {props.children}
    </label>
  );
}

describe("createRadioGroup", () => {
  it("handles defaults", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <RadioGroup label="Favorite Pet" onChange={onChangeSpy}>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radioGroup).toBeInTheDocument();
    expect(radios.length).toBe(3);

    const groupName = radios[0].getAttribute("name");
    expect(radios[0]).toHaveAttribute("name", groupName);
    expect(radios[1]).toHaveAttribute("name", groupName);
    expect(radios[2]).toHaveAttribute("name", groupName);

    expect(radios[0].value).toBe("dogs");
    expect(radios[1].value).toBe("cats");
    expect(radios[2].value).toBe("dragons");

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith("dragons");

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeTruthy();
  });

  it("can have a default value", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <RadioGroup label="Favorite Pet" defaultValue="cats" onChange={onChangeSpy}>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radioGroup).toBeTruthy();
    expect(radios.length).toBe(3);
    expect(onChangeSpy).not.toHaveBeenCalled();

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeTruthy();
    expect(radios[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith("dragons");

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeTruthy();
  });

  it("value can be controlled", async () => {
    const onChangeSpy = jest.fn();
    render(() => (
      <RadioGroup label="Favorite Pet" value="cats" onChange={onChangeSpy}>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeTruthy();
    expect(radios[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith("dragons");

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();

    // false because `value` is controlled
    expect(radios[2].checked).toBeFalsy();
  });

  it("name can be controlled", () => {
    render(() => (
      <RadioGroup label="Favorite Pet" name="test-name">
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).toHaveAttribute("name", "test-name");
    expect(radios[1]).toHaveAttribute("name", "test-name");
    expect(radios[2]).toHaveAttribute("name", "test-name");
  });

  it("supports labeling", () => {
    render(() => (
      <RadioGroup label="Favorite Pet">
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    const labelId = radioGroup.getAttribute("aria-labelledby");

    expect(labelId).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const label = document.getElementById(labelId!);

    expect(label).toHaveTextContent("Favorite Pet");
  });

  it("supports aria-label", () => {
    render(() => (
      <RadioGroup aria-label="My Favorite Pet">
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-label", "My Favorite Pet");
  });

  it("supports custom props", () => {
    render(() => (
      <RadioGroup label="Favorite Pet" data-testid="favorite-pet">
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("data-testid", "favorite-pet");
  });

  it("sets aria-orientation by default", () => {
    render(() => (
      <RadioGroup label="Favorite Pet">
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets aria-orientation based on the orientation prop", () => {
    render(() => (
      <RadioGroup label="Favorite Pet" orientation="horizontal">
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("sets aria-invalid when validationState='invalid'", () => {
    render(() => (
      <RadioGroup label="Favorite Pet" validationState="invalid">
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-invalid", "true");
  });

  it("passes through aria-errormessage", () => {
    render(() => (
      <RadioGroup label="Favorite Pet" validationState="invalid" aria-errormessage="test">
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-invalid", "true");
    expect(radioGroup).toHaveAttribute("aria-errormessage", "test");
  });

  it("sets aria-required when isRequired is true", () => {
    render(() => (
      <RadioGroup label="Favorite Pet" isRequired>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-required", "true");

    const radios = screen.getAllByRole("radio");

    for (const radio of radios) {
      expect(radio).not.toHaveAttribute("aria-required");
    }
  });

  it("sets aria-disabled and makes radios disabled when isDisabled is true", async () => {
    const groupOnChangeSpy = jest.fn();

    render(() => (
      <RadioGroup label="Favorite Pet" isDisabled onChange={groupOnChangeSpy}>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-disabled", "true");

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).toHaveAttribute("disabled");
    expect(radios[1]).toHaveAttribute("disabled");
    expect(radios[2]).toHaveAttribute("disabled");

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(radios[2].checked).toBeFalsy();
  });

  it("can have a single disabled radio", async () => {
    const groupOnChangeSpy = jest.fn();

    render(() => (
      <RadioGroup label="Favorite Pet" onChange={groupOnChangeSpy}>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats" isDisabled>
          Cats
        </Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).not.toHaveAttribute("disabled");
    expect(radios[1]).toHaveAttribute("disabled");
    expect(radios[2]).not.toHaveAttribute("disabled");

    // have to click label or it won't work
    const dogsLabel = screen.getByLabelText("Dogs").parentElement as HTMLLabelElement;
    const catsLabel = screen.getByLabelText("Cats").parentElement as HTMLLabelElement;

    fireEvent.click(catsLabel);
    await Promise.resolve();

    expect(radios[1].checked).toBeFalsy();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeFalsy();

    fireEvent.click(dogsLabel);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(1);
    expect(groupOnChangeSpy).toHaveBeenCalledWith("dogs");
    expect(radios[0].checked).toBeTruthy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeFalsy();
  });

  it("doesn't set aria-disabled or make radios disabled by default", () => {
    render(() => (
      <RadioGroup label="Favorite Pet">
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).not.toHaveAttribute("aria-disabled");

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).not.toHaveAttribute("disabled");
    expect(radios[1]).not.toHaveAttribute("disabled");
    expect(radios[2]).not.toHaveAttribute("disabled");
  });

  it("doesn't set aria-disabled or make radios disabled when isDisabled is false", () => {
    render(() => (
      <RadioGroup label="Favorite Pet" isDisabled={false}>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).not.toHaveAttribute("aria-disabled");

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).not.toHaveAttribute("disabled");
    expect(radios[1]).not.toHaveAttribute("disabled");
    expect(radios[2]).not.toHaveAttribute("disabled");
  });

  it('sets aria-readonly="true" on radio group', async () => {
    const groupOnChangeSpy = jest.fn();
    render(() => (
      <RadioGroup label="Favorite Pet" isReadOnly onChange={groupOnChangeSpy}>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radioGroup).toHaveAttribute("aria-readonly", "true");
    expect(radios[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(radios[2].checked).toBeFalsy();
  });

  it("should not update state for readonly radio group", async () => {
    const groupOnChangeSpy = jest.fn();

    render(() => (
      <RadioGroup label="Favorite Pet" isReadOnly onChange={groupOnChangeSpy}>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    ));

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(radios[2].checked).toBeFalsy();
  });
});
