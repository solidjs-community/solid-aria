/*
 * Copyright 2022 Solid Aria Working Group.
 * MIT License
 *
 * Portions of this file are based on code from react-spectrum.
 * Copyright 2020 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { createRoot, createSignal } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createControllableSignal } from "../src";

describe("createControllableSignal", () => {
  it("should handle setValue behavior (uncontrolled mode)", async () =>
    createRoot(async dispose => {
      const onChangeSpy = jest.fn();

      const [value, setValue] = createControllableSignal<string | undefined>({
        defaultValue: () => "defaultValue",
        onChange: onChangeSpy
      });

      expect(value()).toBe("defaultValue");
      expect(onChangeSpy).not.toHaveBeenCalled();

      setValue("newValue");
      await Promise.resolve();

      expect(value()).toBe("newValue");
      expect(onChangeSpy).toHaveBeenLastCalledWith("newValue");

      // clear it so we can check more easily that it's not called in the next expect
      onChangeSpy.mockClear();

      setValue("newValue");
      await Promise.resolve();

      expect(value()).toBe("newValue");

      // wont invoke onChange for the same value twice in a row
      expect(onChangeSpy).not.toHaveBeenCalled();

      dispose();
    }));

  it("should handle setValue with callback behavior (uncontrolled mode)", async () =>
    createRoot(async dispose => {
      const onChangeSpy = jest.fn();

      const [value, setValue] = createControllableSignal<string | undefined>({
        defaultValue: () => "defaultValue",
        onChange: onChangeSpy
      });

      expect(value()).toBe("defaultValue");
      expect(onChangeSpy).not.toHaveBeenCalled();

      setValue(prevValue => {
        expect(prevValue).toBe("defaultValue");
        return "newValue";
      });
      await Promise.resolve();

      expect(value()).toBe("newValue");
      expect(onChangeSpy).toHaveBeenLastCalledWith("newValue");

      // clear it so we can check more easily that it's not called in the next expect
      onChangeSpy.mockClear();

      setValue(prevValue => {
        expect(prevValue).toBe("newValue");
        return "newValue";
      });
      await Promise.resolve();

      expect(value()).toBe("newValue");

      // wont invoke onChange for the same value twice in a row
      expect(onChangeSpy).not.toHaveBeenCalled();

      dispose();
    }));

  it("should handle setValue behavior (controlled mode)", async () =>
    createRoot(async dispose => {
      const onChangeSpy = jest.fn();

      const [value, setValue] = createControllableSignal<string>({
        value: () => "controlledValue",
        onChange: onChangeSpy
      });

      expect(value()).toBe("controlledValue");
      expect(onChangeSpy).not.toHaveBeenCalled();

      setValue("newValue");
      await Promise.resolve();

      expect(value()).toBe("controlledValue");
      expect(onChangeSpy).toHaveBeenLastCalledWith("newValue");

      // clear it so we can check more easily that it's not called in the next expect
      onChangeSpy.mockClear();

      setValue("controlledValue");
      await Promise.resolve();

      expect(value()).toBe("controlledValue");

      // wont invoke onChange for the same value twice in a row
      expect(onChangeSpy).not.toHaveBeenCalled();

      dispose();
    }));

  it("should handle setValue with callback behavior (controlled mode)", async () =>
    createRoot(async dispose => {
      const onChangeSpy = jest.fn();

      const [value, setValue] = createControllableSignal<string>({
        value: () => "controlledValue",
        onChange: onChangeSpy
      });

      expect(value()).toBe("controlledValue");
      expect(onChangeSpy).not.toHaveBeenCalled();

      setValue(prevValue => {
        expect(prevValue).toBe("controlledValue");
        return "newValue";
      });
      await Promise.resolve();

      expect(value()).toBe("controlledValue");
      expect(onChangeSpy).toHaveBeenLastCalledWith("newValue");

      // clear it so we can check more easily that it's not called in the next expect
      onChangeSpy.mockClear();

      setValue(prevValue => {
        expect(prevValue).toBe("controlledValue");
        return "controlledValue";
      });
      await Promise.resolve();

      expect(value()).toBe("controlledValue");

      // wont invoke onChange for the same value twice in a row
      expect(onChangeSpy).not.toHaveBeenCalled();

      dispose();
    }));

  it("should update value after props.value change (controlled mode)", async () =>
    createRoot(async dispose => {
      const onChangeSpy = jest.fn();

      const TestComponent = (props: any) => {
        const [value] = createControllableSignal<string>(props);

        return <div data-testid="test-component">{value()}</div>;
      };

      const TestComponentWrapper = (props: any) => {
        // eslint-disable-next-line solid/reactivity
        const [state, setState] = createSignal(props.value);
        return (
          <>
            <TestComponent value={state} onChange={onChangeSpy} />
            <button onClick={() => setState("updated")} />
          </>
        );
      };

      render(() => <TestComponentWrapper value="controlledValue" />);

      const button = screen.getByRole("button");
      const testComponent = screen.getByTestId("test-component");

      expect(testComponent).toHaveTextContent("controlledValue");
      expect(onChangeSpy).not.toHaveBeenCalled();

      fireEvent.click(button);
      await Promise.resolve();

      expect(testComponent).toHaveTextContent("updated");
      expect(onChangeSpy).not.toHaveBeenCalled();

      dispose();
    }));

  it("should only trigger onChange once when using using NaN", async () =>
    createRoot(async dispose => {
      const onChangeSpy = jest.fn();

      const [value, setValue] = createControllableSignal<number | undefined>({
        onChange: onChangeSpy
      });

      expect(value()).not.toBeDefined();
      expect(onChangeSpy).not.toHaveBeenCalled();

      setValue(NaN);
      await Promise.resolve();

      expect(value()).toBe(NaN);
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenLastCalledWith(NaN);

      setValue(NaN);
      await Promise.resolve();

      expect(value()).toBe(NaN);
      expect(onChangeSpy).toHaveBeenCalledTimes(1);

      dispose();
    }));
});
