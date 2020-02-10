const withSass = require("@zeit/next-sass");

module.exports = withSass({
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
