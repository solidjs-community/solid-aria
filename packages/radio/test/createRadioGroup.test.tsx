import { splitProps } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import {
  AriaRadioGroupProps,
  AriaRadioProps,
  createRadio,
  createRadioGroup,
  createRadioGroupState,
  RadioGroupState
} from "../src";

function Radio(props: AriaRadioProps & { radioGroupState: RadioGroupState }) {
  const [local, others] = splitProps(props, ["children", "radioGroupState"]);

  let ref: HTMLInputElement | undefined;
  const { inputProps } = createRadio(others, local.radioGroupState, () => ref);

  return (
    <label>
      <input ref={ref} {...inputProps()} />
      {local.children}
    </label>
  );
}

function RadioGroup(props: { groupProps: AriaRadioGroupProps; radioProps: AriaRadioProps[] }) {
  const state = createRadioGroupState(props.groupProps);
  const { groupProps: radioGroupProps, labelProps } = createRadioGroup(props.groupProps, state);

  return (
    <div {...(radioGroupProps() as any)}>
      {props.groupProps.label && <span {...labelProps()}>{props.groupProps.label}</span>}
      <Radio radioGroupState={state} {...props.radioProps[0]} />
      <Radio radioGroupState={state} {...props.radioProps[1]} />
      <Radio radioGroupState={state} {...props.radioProps[2]} />
    </div>
  );
}

describe("createRadioGroup", () => {
  it("handles defaults", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <RadioGroup
        groupProps={{ label: "Favorite Pet", onChange: onChangeSpy }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
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
      <RadioGroup
        groupProps={{ label: "Favorite Pet", defaultValue: "cats", onChange: onChangeSpy }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
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
      <RadioGroup
        groupProps={{ label: "Favorite Pet", value: "cats", onChange: onChangeSpy }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
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
      <RadioGroup
        groupProps={{ name: "test-name", label: "Favorite Pet" }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
    ));

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).toHaveAttribute("name", "test-name");
    expect(radios[1]).toHaveAttribute("name", "test-name");
    expect(radios[2]).toHaveAttribute("name", "test-name");
  });

  it("supports labeling", () => {
    render(() => (
      <RadioGroup
        groupProps={{ label: "Favorite Pet" }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    const labelId = radioGroup.getAttribute("aria-labelledby");

    expect(labelId).toBeDefined();

    const label = document.getElementById(labelId!);

    expect(label).toHaveTextContent("Favorite Pet");
  });

  it("supports aria-label", () => {
    render(() => (
      <RadioGroup
        groupProps={{ "aria-label": "My Favorite Pet" }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-label", "My Favorite Pet");
  });

  it("supports custom props", () => {
    const groupProps = { label: "Favorite Pet", "data-testid": "favorite-pet" };

    render(() => (
      <RadioGroup
        groupProps={groupProps}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("data-testid", "favorite-pet");
  });

  it("sets aria-orientation by default", () => {
    render(() => (
      <RadioGroup
        groupProps={{ label: "Favorite Pet" }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets aria-orientation based on the orientation prop", () => {
    render(() => (
      <RadioGroup
        groupProps={{ label: "Favorite Pet", orientation: "horizontal" }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("sets aria-invalid when validationState='invalid'", () => {
    render(() => (
      <RadioGroup
        groupProps={{ label: "Favorite Pet", validationState: "invalid" }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-invalid", "true");
  });

  it("passes through aria-errormessage", () => {
    render(() => (
      <RadioGroup
        groupProps={{
          label: "Favorite Pet",
          validationState: "invalid",
          "aria-errormessage": "test"
        }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-invalid", "true");
    expect(radioGroup).toHaveAttribute("aria-errormessage", "test");
  });

  it("sets aria-required when isRequired is true", () => {
    render(() => (
      <RadioGroup
        groupProps={{ label: "Favorite Pet", isRequired: true }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
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
      <RadioGroup
        groupProps={{ label: "Favorite Pet", isDisabled: true, onChange: groupOnChangeSpy }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
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
      <RadioGroup
        groupProps={{ label: "Favorite Pet", onChange: groupOnChangeSpy }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats", isDisabled: true },
          { value: "dragons", children: "Dragons" }
        ]}
      />
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
      <RadioGroup
        groupProps={{ label: "Favorite Pet" }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
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
      <RadioGroup
        groupProps={{ label: "Favorite Pet", isDisabled: false }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
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
      <RadioGroup
        groupProps={{ label: "Favorite Pet", isReadOnly: true, onChange: groupOnChangeSpy }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
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
      <RadioGroup
        groupProps={{ label: "Favorite Pet", isReadOnly: true, onChange: groupOnChangeSpy }}
        radioProps={[
          { value: "dogs", children: "Dogs" },
          { value: "cats", children: "Cats" },
          { value: "dragons", children: "Dragons" }
        ]}
      />
    ));

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(radios[2].checked).toBeFalsy();
  });
});
