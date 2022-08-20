const env = process.env.NODE_ENV || "dev";
const serverConfig = require("./serverConfigs");

const knex = require("knex")({
  client: "pg",
  connection: serverConfig.database.postgres[env],
});

module.exports = knex;