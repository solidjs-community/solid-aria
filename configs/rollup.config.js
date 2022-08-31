import withSolid from "rollup-preset-solid";
import json from "@rollup/plugin-json";

export default withSolid({
  input: "src/index.tsx",
  targets: ["esm", "cjs"],
  plugins: [json()]
});
