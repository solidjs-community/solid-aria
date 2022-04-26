import { render } from "solid-js/web";

import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  createListBox,
  createListBoxOption
} from "../src";
import { ListBoxProvider } from "../src/context";

function ListBox(props: AriaListBoxProps) {
  const { listBoxProps } = createListBox(props);

  return (
    <ListBoxProvider>
      <ul {...listBoxProps()}>{props.children}</ul>
    </ListBoxProvider>
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
