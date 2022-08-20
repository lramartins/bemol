const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const messages = require("../helpers/messages");
const webConfig = require("../config/serverConfigs");

module.exports = async (req) => {
  let token = req.headers.authorization;

  if (!token) return { msg: messages.tokenNotProvided, status: 400 };

  [, token] = token.split(" ");

  try {
    let payload = await promisify(jwt.verify)(token, webConfig.secret);
    if (!payload) return { msg: messages.invalidToken, status: 400 };

    req.params.userid = payload.id;
  } catch (e) {
    return { msg: messages.invalidToken, status: 400 };
  }
};
