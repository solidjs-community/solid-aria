import { PropsWithChildren } from "solid-js";
import { render } from "solid-js/web";

import { AriaListBoxSectionProps, createListBoxSection } from "../src";

function Section(props: PropsWithChildren<AriaListBoxSectionProps>) {
  const { itemProps, headingProps, groupProps } = createListBoxSection(props);

  return (
    <li {...itemProps()}>
      <span
        {...headingProps()}
        style={{
          "font-weight": "bold",
          "font-size": "1.1em",
          padding: "2px 5px"
        }}
      >
        {props.heading}
      </span>
      <ul
        {...groupProps}
        style={{
          padding: 0,
          "list-style": "none"
        }}
      >
        {props.children}
      </ul>
    </li>
  );
}

function App() {
  return (
    <div>
      <Section heading="Section 1">
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
      </Section>
    </div>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
