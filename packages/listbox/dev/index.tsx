import { createFocusRing } from "@solid-aria/focus";
import { combineProps } from "@solid-aria/utils";
import { render } from "solid-js/web";

import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  createListBox,
  createListBoxOption,
  createListBoxState
} from "../src";
import { ListBoxContext } from "../src/context";

function ListBox(props: AriaListBoxProps) {
  let ref: HTMLUListElement | undefined;

  const state = createListBoxState(props);
  const { labelProps, listBoxProps } = createListBox(props, state);

  return (
    <ListBoxContext.Provider value={state}>
      <>
        <div {...labelProps()}>{props.label}</div>
        <ul
          {...listBoxProps()}
          ref={ref}
          style={{
            padding: 0,
            margin: "5px 0",
            "list-style": "none",
            border: "1px solid gray",
            "max-width": "250px"
          }}
        >
          {props.children}
        </ul>
      </>
    </ListBoxContext.Provider>
  );
}

function Option(props: AriaListBoxOptionProps) {
  let ref: HTMLLIElement | undefined;

  const { optionProps, isSelected, isDisabled } = createListBoxOption(props, () => ref);

  const { isFocusVisible, focusProps } = createFocusRing();

  return (
    <li
      {...combineProps(optionProps(), focusProps())}
      ref={ref}
      style={{
        background: isSelected() ? "blueviolet" : "transparent",
        color: isSelected() ? "white" : null,
        padding: "2px 5px",
        outline: isFocusVisible() ? "2px solid orange" : "none",
        opacity: isDisabled() ? 0.4 : 1
      }}
    >
      {props.children} {isSelected() && "(Selected)"}
    </li>
  );
}

function App() {
  //const [keys, setKeys] = createSignal<Set<string>>(new Set(["1", "3"]));

  return (
    <div>
      <ListBox label="Select a value" allowEmptySelection>
        <Option value="1" isDisabled>
          One
        </Option>
        <Option value="2" isDisabled>
          Two
        </Option>
        <Option value="3">Three</Option>
        <Option value="4">Four</Option>
        <Option value="5" isDisabled>
          Five
        </Option>
        <Option value="6">Six</Option>
        <Option value="7" isDisabled>
          Seven
        </Option>
        <Option value="8">Eight</Option>
        <Option value="9">Nine</Option>
        <Option value="10" isDisabled>
          Ten
        </Option>
      </ListBox>

      {/* <ul role="listbox">
        <li role="presentation" aria-labelledby="cl-1">
          <span aria-hidden="true" id="cl-1">Section Label</span>
          <ul role="group">
            <li role="option"></li>
          </ul>
        </li>
      </ul> */}
    </div>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
