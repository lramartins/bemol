const express = require("express");
const app = express();
const env = process.env.NODE_ENV || "dev";
const cors = require("./middlewares/cors");
const serverConfigs = require("./config/serverConfigs");
const routes = require("./config/routes");
const pkg = require("../package.json");

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res
    .json({
      name: pkg.name,
      version: pkg.version,
      current_timestamp: new Date().getTime(),
    })
    .send();
});

routes(app);

app.listen(serverConfigs.server[env].port, (error) => {
  if (error) throw error;

  console.log(
    `Servidor rodando em: ${serverConfigs.server[env].url}:${serverConfigs.server[env].port} em ambiente de ${serverConfigs.envoriment[env]}`
  );
});
