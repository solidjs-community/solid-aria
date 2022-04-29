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
  const { listBoxProps } = createListBox(props, state);

  return (
    <ListBoxContext.Provider value={state}>
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
      {props.children}
    </li>
  );
}

function App() {
  return (
    <ListBox>
      <Option value="1">One</Option>
      <Option value="2">Two</Option>
      <Option value="3">Three</Option>
      <Option value="4">Four</Option>
      <Option value="5">Five</Option>
    </ListBox>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
