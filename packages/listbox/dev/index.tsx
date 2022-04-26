import { render } from "solid-js/web";

import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  createListBox,
  createListBoxOption
} from "../src";

function ListBox(props: AriaListBoxProps) {
  const { listBoxProps, labelProps } = createListBox(props);

  return (
    <div>
      <span {...labelProps()}>{props.label}</span>
      <ul {...listBoxProps()}>{props.children}</ul>
    </div>
  );
}

function Option(props: AriaListBoxOptionProps) {
  const { optionProps, labelProps, descriptionProps } = createListBoxOption(props);

  return (
    <li {...optionProps()}>
      <span {...labelProps()}>Title</span>
      <span {...descriptionProps()}>{props.children}</span>
    </li>
  );
}

function App() {
  return (
    <div>
      <ListBox label="Label" id="foo">
        <Option>One</Option>
        <Option>Two</Option>
        <Option>Three</Option>
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
