import { createFocusRing } from "@solid-aria/focus";
import { createContext, createSignal, useContext } from "solid-js";
import { render } from "solid-js/web";

import {
  AriaRadioGroupProps,
  AriaRadioProps,
  createRadio,
  createRadioGroup,
  createRadioGroupState,
  RadioGroupState
} from "../src";

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
  const { isFocusVisible, focusRingProps } = createFocusRing();

  const isSelected = () => state?.value() === props.value;
  const strokeWidth = () => (isSelected() ? 6 : 2);

  return (
    <label style={{ display: "flex", "align-items": "center" }}>
      <div>
        <input {...inputProps()} {...focusRingProps()} ref={ref} />
      </div>
      <svg width={24} height={24} aria-hidden="true" style={{ "margin-right": "4px" }}>
        <circle
          cx={12}
          cy={12}
          r={8 - strokeWidth() / 2}
          fill="none"
          stroke={isSelected() ? "orange" : "gray"}
          stroke-width={strokeWidth()}
        />
        {isFocusVisible() && (
          <circle cx={12} cy={12} r={11} fill="none" stroke="orange" stroke-width={2} />
        )}
      </svg>
      {props.children}
    </label>
  );
}

function App() {
  const [value, setValue] = createSignal("cats");
  return (
    <div>
      <span>{value()}</span>
      <button onClick={() => setValue("dragons")}>Choose dragons</button>
      <RadioGroup label="Favorite pet" value={value()} onChange={setValue}>
        <Radio value="dogs">Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    </div>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
