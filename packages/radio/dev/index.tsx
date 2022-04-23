import { render } from "solid-js/web";

import {
  AriaRadioGroupProps,
  AriaRadioProps,
  createRadio,
  createRadioGroup,
  createRadioGroupState,
  RadioGroupState
} from "../src";

import { createContext, useContext } from "solid-js";

const RadioContext = createContext<RadioGroupState>();

function RadioGroup(props: AriaRadioGroupProps) {
  const state = createRadioGroupState(props);
  const { groupProps, labelProps } = createRadioGroup<"div", "span">(props, state);

  return (
    <div {...groupProps()}>
      <span {...labelProps()}>{props.label}</span>
      <RadioContext.Provider value={state}>{props.children}</RadioContext.Provider>
    </div>
  );
}

function Radio(props: AriaRadioProps) {
  let ref: HTMLInputElement | undefined;
  const state = useContext(RadioContext);

  const { inputProps } = createRadio(props, state!, () => ref);

  return (
    <label style={{ display: "block" }}>
      <input {...inputProps} ref={ref} />
      {props.children}
      {state?.isSelected(props.value) && <span> checked</span>}
    </label>
  );
}

function App() {
  const onChange = (value: string) => {
    console.log(value);
  };

  return (
    <RadioGroup label="Favorite pet" value="cats" onChange={onChange}>
      <Radio value="dogs">Dogs</Radio>
      <Radio value="cats">Cats</Radio>
      <Radio value="dragons">Dragons</Radio>
    </RadioGroup>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
