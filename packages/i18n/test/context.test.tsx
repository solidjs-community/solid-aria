import { render, screen } from "solid-testing-library";

import { I18nProvider, useLocale } from "../src";

function Example() {
  const locale = useLocale();
  return (
    <>
      <span data-testid="locale">{locale().locale}</span>
      <span data-testid="direction">{locale().direction}</span>
    </>
  );
}

describe("I18nProvider", () => {
  it("should use default locale when no one is provided", () => {
    render(() => (
      <I18nProvider>
        <Example />
      </I18nProvider>
    ));

    const locale = screen.getByTestId("locale");
    const direction = screen.getByTestId("direction");

    expect(locale).toHaveTextContent("en-US");
    expect(direction).toHaveTextContent("ltr");
  });

  it("should use provided locale", () => {
    render(() => (
      <I18nProvider locale="ar-AR">
        <Example />
      </I18nProvider>
    ));

    const locale = screen.getByTestId("locale");
    const direction = screen.getByTestId("direction");

    expect(locale).toHaveTextContent("ar-AR");
    expect(direction).toHaveTextContent("rtl");
  });
});
