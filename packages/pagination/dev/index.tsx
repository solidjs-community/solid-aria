import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { PaginationInput } from "./PaginationInput";

function App() {
  const [page, setPage] = createSignal(1);
  return (
    <PaginationInput
      maxValue={20}
      value={page()}
      onChange={value => {
        console.log(value);
        setPage(value);
      }}
      onNext={() => console.log("on next")}
      onPrevious={() => console.log("on previous")}
    />
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
