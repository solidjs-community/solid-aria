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
      <ul {...listBoxProps()} ref={ref}>
        {props.children}
      </ul>
    </ListBoxContext.Provider>
  );
}

function Option(props: AriaListBoxOptionProps) {
  const { optionProps } = createListBoxOption(props);

  return <li {...optionProps()}>{props.children}</li>;
}

function App() {
  return (
    <div>
      <ListBox>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
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
