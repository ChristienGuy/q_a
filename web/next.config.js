const withSass = require("@zeit/next-sass");
const withCss = require("@zeit/next-css");

module.exports = withSass(
  withCss({
    cssModules: true,
    experimental: {
      async rewrites() {
        return [
          {
            source: "/api/graphql",
            destination: process.env.API_URL
          }
        ];
      }
    },
    env: {
      API_URL: process.env.API_URL,
      WEB_URL: process.env.WEB_URL
    }
  })
);
