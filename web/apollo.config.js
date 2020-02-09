const path = require("path");

module.exports = {
  client: {
    service: {
      name: "qa-server",
      localSchemaFile: path.resolve(__dirname, "../api/schema.gql"),
      includes: [path.resolve(__dirname, "../api/**/*.ts")]
    }
  }
};
