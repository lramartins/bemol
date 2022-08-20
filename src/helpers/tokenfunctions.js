const jwt = require("jsonwebtoken");
const config = require("../config/serverConfigs");
const bcrypt = require("bcryptjs");

async function compareHash(senha, usuario) {
  return await bcrypt.compare(senha, usuario.user_password);
}

async function createHash(senha) {
  return await bcrypt.hash(senha, 10);
}

async function generateToken(usuario) {
  return jwt.sign(
    {
      pkuser: usuario.pkuser,
      firstname: usuario.firstname,
      email: usuario.email,
    },
    config.secret,
    {
      expiresIn: 86400,
    }
  );
}

module.exports = {
  compareHash,
  createHash,
  generateToken,
};