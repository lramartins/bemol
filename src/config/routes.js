const fs = require("fs");
const auth = require("../middlewares/auth");

function api(controllerFunction, public) {
  return async (req, res, next) => {
    if (!public) {
      let authresponse = await auth(req, res, next);
      if (authresponse && authresponse.status) return res.json(authresponse);
    }

    const controllerReturn = controllerFunction(req, res);

    return controllerReturn;
  };
}

module.exports = (app) => {
  fs.readdir("./src/app/", (err, folders) => {
    folders.forEach((folder) => {
      const routes = `./src/app/${folder}/index.js`;
      if (fs.existsSync(routes)) {
        require(`../app/${folder}/index`).map((route) => {
          app[route.verb](route.endpoint, api(route.controllerFunction, route.public));
        });
      }
    });
  });
};