import { CollectionBase, ForItems, Item } from "@solid-aria/collection";
import { createSignal, For } from "solid-js";
import { render } from "solid-js/web";

import { createListState } from "../src";

function ListBox(props: CollectionBase) {
  // Create state based on the incoming props
  const state = createListState(props);

  return (
    <ul>
      <ForItems in={state.collection()}>
        {item => <Option key={item().key} item={item()} state={state} />}
      </ForItems>
    </ul>
  );
}

function Option(props: any) {
  return <li style={{ padding: "2px 5px" }}>{props.item.rendered()}</li>;
}

function App() {
  const [fruits, setFruits] = createSignal([{ name: "Fruit 1" }]);

  const addFruit = () => {
    setFruits(prev => [...prev, { name: `Fruit ${prev.length + 1}` }]);
  };

  return (
    <>
      <button onClick={addFruit}>Add Fruit</button>
      <ListBox>
        <For each={fruits()}>{fruit => <Item key={fruit.name}>{fruit.name}</Item>}</For>
      </ListBox>
    </>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
