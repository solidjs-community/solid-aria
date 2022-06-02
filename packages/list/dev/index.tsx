import { Item, Section } from "@solid-aria/collection";
import { createSignal, For, Show } from "solid-js";
import { render } from "solid-js/web";

import { createListState } from "../src";

function ListBox(props: any) {
  // Create state based on the incoming props
  const state = createListState<any>(props);

  return (
    <>
      <div>{props.label}</div>
      <ul
        style={{
          padding: 0,
          margin: "5px 0",
          "list-style": "none",
          border: "1px solid gray",
          "max-width": "450px"
        }}
      >
        <For each={[...state.collection()]}>
          {item => <OptGroup key={item.key} section={item} state={state} />}
        </For>
      </ul>
    </>
  );
}

function OptGroup(props: any) {
  // If the section is not the first, add a separator element.
  // The heading is rendered inside an <li> element, which contains
  // a <ul> with the child items.

  return (
    <>
      {props.section.key !== props.state.collection().getFirstKey() && (
        <li
          style={{
            "border-top": "1px solid gray",
            margin: "2px 5px"
          }}
        />
      )}
      <li>
        <Show when={props.section.rendered()}>
          <span
            style={{
              "font-weight": "bold",
              "font-size": "1.1em",
              padding: "2px 5px"
            }}
          >
            {props.section.key} - {props.section.rendered()}
          </span>
        </Show>
        <ul
          style={{
            padding: props.section.level * 10 || 10,
            "list-style": "none"
          }}
        >
          <For each={[...props.section.childNodes]}>
            {node => (
              <Show
                when={node.hasChildNodes}
                fallback={<Option key={node.key} item={node} state={props.state} />}
              >
                <OptGroup key={node.key} section={node} state={props.state} />
              </Show>
            )}
          </For>
        </ul>
      </li>
    </>
  );
}

function Option(props: any) {
  return (
    <li style={{ padding: "2px 5px" }}>
      {props.key} - {props.item.rendered()}
    </li>
  );
}

function App() {
  const [foo, setFoo] = createSignal(0);
  const [fruits, setFruits] = createSignal(["Banana", "Peach"]);

  const incrementFoo = () => setFoo(prev => prev + 1);
  const addApple = () => setFruits(prev => [...prev, "Apple"]);

  return (
    <>
      <button onClick={incrementFoo}>Increment foo</button>
      <button onClick={addApple}>Add Apple</button>
      <ListBox>
        <Item>Dashboard</Item>
        <Section title="Sales">
          <Item>Invoices</Item>
          <Item>Customers</Item>
          <Item title="Create New">
            <Item>Create invoice</Item>
            <Item>Create customer {foo()}</Item>
          </Item>
        </Section>
        <Section title="Expenses">
          <Item>Incomes</Item>
          <Item>Outcomes</Item>
        </Section>
        <Item>Settings</Item>
      </ListBox>
    </>
  );
  //return <div>Hello Solid Aria!</div>;
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
