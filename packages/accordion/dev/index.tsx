import { ForItems, Item } from "@solid-aria/collection";
import { filterDOMProps } from "@solid-aria/utils";
import { createMemo, mergeProps, onMount } from "solid-js";
import { render } from "solid-js/web";

import {
  AriaAccordionItemProps,
  AriaAccordionProps,
  createAccordion,
  createAccordionItem
} from "../src";

function AccordionItem(props: AriaAccordionItemProps) {
  let ref: HTMLButtonElement | undefined;

  const { buttonProps, regionProps, isExpanded } = createAccordionItem(props, () => ref);

  return (
    <div>
      <h3 style={{ margin: 0, padding: 0 }}>
        <button
          {...buttonProps}
          ref={ref}
          style={{
            appearance: "none",
            border: "none",
            display: "block",
            margin: 0,
            padding: "1em 1.5em",
            "text-align": "left",
            width: "100%"
          }}
        >
          {props.item.rendered()}
        </button>
      </h3>
      <div
        {...regionProps}
        style={{
          display: isExpanded() ? "block" : "none",
          margin: 0,
          padding: "1em 1.5em"
        }}
      >
        {props.item.props.children}
      </div>
    </div>
  );
}

function Accordion(props: AriaAccordionProps) {
  let ref: HTMLDivElement | undefined;

  const { AccordionProvider, accordionProps, state } = createAccordion(props, () => ref);

  const domProps = createMemo(() => filterDOMProps(props));

  const rootProps = mergeProps(domProps, accordionProps);

  return (
    <div
      {...rootProps}
      ref={ref}
      style={{
        margin: 0,
        padding: 0,
        border: "2px solid gray",
        width: "10rem"
      }}
    >
      <AccordionProvider>
        <ForItems in={state.collection()}>{item => <AccordionItem item={item()} />}</ForItems>
      </AccordionProvider>
    </div>
  );
}

function Foo(props: any) {
  onMount(() => console.log("created", props.key));

  return <>{props.children}</>;
}

function App() {
  return (
    <Accordion disabledKeys={["two"]}>
      <Item key="one" title="Section One">
        <Foo key="1">Content One</Foo>
      </Item>
      <Item key="two" title="Section Two">
        <Foo key="2">Content Two</Foo>
      </Item>
      <Item key="three" title="Section Three">
        <Foo key="3">Content Three</Foo>
      </Item>
    </Accordion>
  );
  //return <div>Hello Solid Aria!</div>;
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
