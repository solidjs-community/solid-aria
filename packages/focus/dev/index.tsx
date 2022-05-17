import { render } from "solid-js/web";

import { FocusScope } from "../src";

function App() {
  return (
    <div>
      <input data-testid="outside" placeholder="outside" />
      <FocusScope autoFocus restoreFocus contain>
        <input data-testid="parent1" placeholder="parent1" />
        <input data-testid="parent2" placeholder="parent2" />
        <input data-testid="parent3" placeholder="parent3" />
        <div>
          <div>
            <FocusScope autoFocus restoreFocus contain>
              <input data-testid="child1" placeholder="child1" />
              <input data-testid="child2" placeholder="child2" />
              <input data-testid="child3" placeholder="child3" />
            </FocusScope>
          </div>
        </div>
      </FocusScope>
    </div>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
