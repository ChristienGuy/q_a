const withSass = require("@zeit/next-sass");

module.exports = withSass({
  cssModules: true,
  experimental: {
    async rewrites() {
      return [
        {
          source: "/api/graphql",
          destination: process.env.API_BASE_URL
        }
      ];
    }
  }
});
