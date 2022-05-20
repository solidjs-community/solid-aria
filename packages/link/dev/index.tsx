import { JSX } from "solid-js";
import { render } from "solid-js/web";

import { AriaLinkProps, createLink } from "../src";

type LinkProps = AriaLinkProps & JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

function Link(props: LinkProps) {
  let ref: HTMLAnchorElement | undefined;

  const { linkProps } = createLink(props, () => ref);

  return (
    <a {...linkProps()} ref={ref} href={props.href} target={props.target} style={{ color: "blue" }}>
      {props.children}
    </a>
  );
}

function App() {
  return (
    <Link href="https://www.solidjs.com" target="_blank">
      SolidJS
    </Link>
  );
}

// function App() {
//   return <div>Hello Solid Aria!</div>;
// }

render(() => <App />, document.getElementById("root") as HTMLDivElement);
