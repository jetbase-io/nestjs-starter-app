/** @type {import('next').NextConfig} */

const path = require("path");
const { i18n } = require("./next-i18next.config");
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  sassOptions: {
    includePaths: [path.join(__dirname, "assets/styles")],
    prependData: `@import "variables.scss";`,
  },
};

module.exports = nextConfig;
