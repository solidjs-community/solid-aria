/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

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
