import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { PaginationInput } from "./PaginationInput";

function App() {
  const [page, setPage] = createSignal(1);
  return (
    <>
      <h1>Controlled</h1>
      <PaginationInput
        value={page()}
        maxValue={20}
        onChange={value => {
          console.log("controlled -> onChange", value);
          setPage(value);
        }}
        onNext={value => console.log("controlled -> on next", value)}
        onPrevious={value => console.log("controlled -> on previous", value)}
      />

      <h1>Uncontrolled</h1>
      <PaginationInput
        maxValue={20}
        defaultValue={1}
        onChange={value => console.log("uncontrolled -> onChange", value)}
        onNext={value => console.log("uncontrolled -> on next", value)}
        onPrevious={value => console.log("uncontrolled -> on previous", value)}
      />
    </>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
