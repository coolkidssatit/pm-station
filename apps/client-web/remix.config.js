// @ts-check

const { getPackages, getPackagesPaths, setupTestEnv } = require("build-config");
const { withEsbuildOverride } = require("remix-esbuild-override");

if (process.env.NODE_ENV === "test") {
  // Sets test environment variables
  setupTestEnv("client-web");
}

withEsbuildOverride((option) => {
  // update the option
  option.plugins = [
    {
      name: "transpile-external-modules",
      setup(build) {
        build.onResolve(
          {
            filter: new RegExp(
              getPackages()
                .map((v) => `(${v})`)
                .join("|")
                .replace(/\//g, "/")
            ),
          },
          (args) => {
            return {
              external: false,
              namespace: args.path,
            };
          }
        );
      },
    },
    ...(option.plugins ?? []),
  ];

  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "vercel",
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: ".netlify/functions-internal/server.js",
  // publicPath: "/build/",
  server: process.env.NODE_ENV === "production" ? "./server.js" : undefined,
  serverDependenciesToBundle: [/^@station\//, "shared"],
  watchPaths: async () => {
    return getPackagesPaths().map((p) => `../../${p}/**/*`);
  },
};
