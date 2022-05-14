import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "solid-testing-library";

import { FocusScope } from "../src";

let spyRequestAnimationFrame: any;

describe("FocusScope", () => {
  beforeEach(() => {
    spyRequestAnimationFrame = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(cb => {
        cb(0);
        return 0;
      });
  });

  afterEach(() => {
    spyRequestAnimationFrame.mockRestore();
  });

  describe("focus containment", () => {
    it("should contain focus within the scope", async () => {
      render(() => (
        <FocusScope contain>
          <input data-testid="input1" />
          <input data-testid="input2" />
          <input data-testid="input3" />
        </FocusScope>
      ));

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");
      const input3 = screen.getByTestId("input3");

      input1.focus();
      fireEvent.focus(input1);
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      userEvent.tab();
      await Promise.resolve();

      expect(document.activeElement).toBe(input2);

      userEvent.tab();
      await Promise.resolve();

      expect(document.activeElement).toBe(input3);

      userEvent.tab();
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      userEvent.tab({ shift: true });
      await Promise.resolve();

      expect(document.activeElement).toBe(input3);

      userEvent.tab({ shift: true });
      await Promise.resolve();

      expect(document.activeElement).toBe(input2);

      userEvent.tab({ shift: true });
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);
    });
  });
});
