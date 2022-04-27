import { createContext, JSX, useContext } from "solid-js";

interface ListBoxProviderProps {
  /**
   * Children of the provider.
   */
  children?: JSX.Element;
}

type ListBoxContextValue = {};

const ListBoxContext = createContext<ListBoxContextValue>();

export function ListBoxProvider(props: ListBoxProviderProps) {
  const context: ListBoxContextValue = {};

  return <ListBoxContext.Provider value={context}>{props.children}</ListBoxContext.Provider>;
}

export function useListBoxContext() {
  const context = useContext(ListBoxContext);

  if (!context) {
    throw new Error("[solid-aria]: useListBoxContext should be used in a ListBoxProvider.");
  }

  return context;
}
