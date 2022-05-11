import { render } from "solid-js/web";

import { createOverlayTrigger } from "../src";

function App() {
  const { triggerProps, overlayProps, state } = createOverlayTrigger({
    type: "listbox"
  });

  return (
    <>
      <button {...triggerProps()} onClick={() => state.toggle()}>
        {state.isOpen() ? "Close" : "Open"}
      </button>
      <div {...overlayProps()}>Hello Solid Aria!</div>
    </>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
