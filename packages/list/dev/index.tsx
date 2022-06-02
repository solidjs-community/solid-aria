import { CollectionBase, Item, Section } from "@solid-aria/collection";
import { createSignal, For, Show } from "solid-js";
import { render } from "solid-js/web";

import { createListState } from "../src";

function ListBox<T>(props: CollectionBase<T>) {
  // Create state based on the incoming props
  const state = createListState<any>(props);

  return (
    <>
      <ul
        style={{
          padding: 0,
          margin: "5px 0",
          "list-style": "none",
          border: "1px solid gray",
          "max-width": "250px"
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
            {props.section.rendered()}
          </span>
        </Show>
        <ul
          style={{
            padding: 0,
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
  return <li style={{ padding: "2px 5px" }}>{props.item.rendered()}</li>;
}

function App() {
  const [sections, setSections] = createSignal([
    {
      name: "People",
      items: [{ name: "David" }, { name: "Same" }, { name: "Jane" }]
    },
    {
      name: "Animals",
      items: [{ name: "Aardvark" }, { name: "Kangaroo" }, { name: "Snake" }]
    }
  ]);
  return (
    <>
      {/* <ListBox>
        <Item>
          {(() => {
            console.log(`Rendered item children`);
            return <span>Content</span>;
          })()}
        </Item>
        <Section>
          <Item>
            {(() => {
              console.log(`Rendered section children`);
              return <span>Content</span>;
            })()}
          </Item>
        </Section>
      </ListBox> */}
      {/* <ListBox items={sections()}>
        {section => (
          <Section key={section.name} title={section.name} items={section.items}>
            {item => (
              <Item key={item.name}>
                {(() => {
                  console.log(`Rendered ${item.name} children`);
                  return <span>{item.name}</span>;
                })()}
              </Item>
            )}
          </Section>
        )}
      </ListBox> */}
      <ListBox>
        <For each={["Banana", "Peach", "Apple"]}>{fruit => <Item key={fruit}>{fruit}</Item>}</For>
      </ListBox>
      <ListBox>
        <For each={sections()}>
          {section => (
            <Section key={section.name} title={section.name}>
              <For each={section.items}>
                {item => (
                  <Item key={item.name}>
                    {(() => {
                      console.log(`Rendered ${item.name} children`);
                      return <span>{item.name}</span>;
                    })()}
                  </Item>
                )}
              </For>
            </Section>
          )}
        </For>
      </ListBox>
    </>
  );
  //return <div>Hello Solid Aria!</div>;
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
