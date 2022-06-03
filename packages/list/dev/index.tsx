import { CollectionBase, Item } from "@solid-aria/collection";
import { createSignal, For } from "solid-js";
import { render } from "solid-js/web";

import { createListState } from "../src";

function ListBox(props: CollectionBase) {
  // Create state based on the incoming props
  const state = createListState(props);

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
          {item => <Option key={item.key} item={item} state={state} />}
        </For>
      </ul>
    </>
  );
}

function Option(props: any) {
  return <li style={{ padding: "2px 5px" }}>{props.item.rendered()}</li>;
}

function App() {
  const [fruits, setFruits] = createSignal(["Fruit 0"]);

  const addFruit = () => {
    setFruits(prev => [...prev, "Fruit " + prev.length]);
  };

  return (
    <>
      <button onClick={addFruit}>Add Fruit</button>
      <ListBox>
        <For each={fruits()}>{fruit => <Item>{fruit}</Item>}</For>
      </ListBox>
    </>
  );
  //return <div>Hello Solid Aria!</div>;
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
