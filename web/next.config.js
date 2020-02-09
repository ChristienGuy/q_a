const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  cssModules: true,
  experimental: {
    async rewrites() {
      return [
        {
          source: "/api/graphql",
          destination: "http://localhost:8888/graphql"
        }
      ];
    }
  }
});
