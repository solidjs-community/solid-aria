import { render } from "solid-js/web";
import { AriaListBoxOptionProps, createListBoxOption } from "../src";

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
      <span id="cl-0">Label</span>
      <ul role="listbox" aria-labelledby="cl-0" aria-multiselectable="false">
        <Option>One</Option>
        <Option aria-selected="true">Two</Option>
        <Option aria-disabled="true">Three</Option>
      </ul>
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
