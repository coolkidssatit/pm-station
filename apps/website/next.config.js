const { EnvironmentPlugin } = require("webpack");

const { parsed: serverEnvVars } = require("dotenv").config({
  path: "../../.env",
});

const clientEnvVars = serverEnvVars
  ? Object.fromEntries(
      Object.entries(serverEnvVars).filter(([key]) =>
        key.startsWith("NEXT_PUBLIC_")
      )
    )
  : {};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      { protocol: "https", hostname: "i.scdn.co" },
    ],
  },
  experimental: {
    serverActions: true,
  },
  transpilePackages: ["@station/db"],
  webpack: (config, { isServer }) => {
    const envToInject = isServer ? serverEnvVars : clientEnvVars;
    if (envToInject) {
      config.plugins.push(
        new EnvironmentPlugin(isServer ? serverEnvVars : clientEnvVars)
      );
    }
    return config;
  },
};

module.exports = nextConfig;
