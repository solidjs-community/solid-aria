import { ForItems, Item } from "@solid-aria/collection";
import { render } from "solid-js/web";

import {
  AriaTabListProps,
  AriaTabPanelProps,
  AriaTabProps,
  createTab,
  createTabList,
  createTabPanel,
  useTabListContext
} from "../src";

function Tabs(props: AriaTabListProps) {
  let ref: HTMLDivElement | undefined;

  const { TabListProvider, state, tabListProps } = createTabList(props, () => ref);

  return (
    <TabListProvider>
      <div style={{ height: "150px" }}>
        <div
          {...tabListProps}
          ref={ref}
          style={{ display: "flex", "border-bottom": "1px solid grey" }}
        >
          <ForItems in={state.collection()}>{item => <Tab item={item()} />}</ForItems>
        </div>
        <TabPanel />
      </div>
    </TabListProvider>
  );
}

function Tab(props: AriaTabProps) {
  let ref: HTMLDivElement | undefined;

  const { tabProps, isSelected, isDisabled } = createTab(props, () => ref);

  return (
    <div
      {...tabProps}
      ref={ref}
      style={{
        padding: "10px",
        "border-bottom": isSelected() ? "3px solid dodgerblue" : "none",
        opacity: isDisabled() ? 0.5 : undefined
      }}
    >
      {props.item.title}
    </div>
  );
}

function TabPanel(props: AriaTabPanelProps) {
  let ref: HTMLDivElement | undefined;

  const { state } = useTabListContext();

  const { tabPanelProps } = createTabPanel(props, () => ref);

  return (
    <div {...tabPanelProps} ref={ref} style={{ padding: "10px" }}>
      {state.selectedItem()?.children}
    </div>
  );
}

function App() {
  return (
    <>
      <Tabs aria-label="Tabs example" disabledKeys={["three"]}>
        <Item key="one" title="One">
          <input type="text" placeholder="content one" />
        </Item>
        <Item key="two" title="Two">
          Content Two
        </Item>
        <Item key="three" title="Three">
          Content Three
        </Item>
      </Tabs>
    </>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
