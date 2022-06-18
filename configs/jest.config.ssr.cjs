const pkgRootPath = `<rootDir>`;
const solidjsPath = `${pkgRootPath}/../../node_modules/solid-js`;

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: "ts-jest",

  globals: {
    "ts-jest": {
      tsconfig: `${pkgRootPath}/tsconfig.json`,
      babelConfig: {
        presets: ["@babel/preset-env", ["babel-preset-solid", { generate: "ssr" }]]
      }
    }
  },

  testEnvironment: "node",

  moduleNameMapper: {
    "solid-js/web": `${solidjsPath}/web/dist/server.cjs`,
    "solid-js/store": `${solidjsPath}/store/dist/server.cjs`,
    "solid-js": `${solidjsPath}/dist/server.cjs`
  },

  testMatch: ["**/test/ssr/*.test.(js|ts)?(x)"],

  verbose: true,
  testTimeout: 30000
};
