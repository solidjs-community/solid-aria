jest.mock("solid-js/web", () => ({
  ...jest.requireActual("solid-js/web"),
  template: jest.fn()
}));

export {};
