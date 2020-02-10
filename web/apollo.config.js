const path = require("path");

module.exports = {
  client: {
    includes: [path.resolve(__dirname, "./**/*.tsx")],
    service: {
      name: "qa-server",
      url: "http://localhost:8888/graphql"
    }
  }
};
