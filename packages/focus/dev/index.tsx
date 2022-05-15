import { render } from "solid-js/web";

import { FocusScope } from "../src";

function App() {
  return (
    <FocusScope autoFocus>
      <div />
      <input data-testid="input1" />
      <input data-testid="input2" autofocus />
      <input data-testid="input3" />
    </FocusScope>
  );
}

// function App() {
//   return <div>Hello Solid Aria!</div>;
// }

render(() => <App />, document.getElementById("root") as HTMLDivElement);
