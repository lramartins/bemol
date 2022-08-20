const {
  compareHash,
  generateToken,
  createHash,
} = require("../../helpers/tokenfunctions");
const { validatePatternsUser } = require('../../helpers/validatePatterns');

const userModel = require("./userModel");
const messages = require("../../helpers/messages");

async function register(req, res) {
  try {
    let userToInsert = req.body;
    let newUser = {};

    for (const key in userToInsert) {
      if (Object.hasOwnProperty.call(userToInsert, key)) {
        if (
          userToInsert[key].length <= 0 ||
          userToInsert[key].trim().length <= 0
        ) {
          switch (key) {
            case "first_name":
              return res
                .status(400)
                .send({ msg: messages.firstNameNotProvided });
            case "last_name":
              return res
                .status(400)
                .send({ msg: messages.lastNameNotProvided });
            case "email":
              return res.status(400).send({ msg: messages.emailNotProvided });
            case "user_password":
              return res
                .status(400)
                .send({ msg: messages.passwordNotProvided });
            default:
              continue;
          }
        } else {
          newUser[key] = userToInsert[key].trim();
        }
      }
    }

    let rejectFields = validatePatternsUser(newUser);

    if (rejectFields.length) return res.status(400).send({ msg: rejectFields });

    if (await userModel.getAllUsersByEmail(userToInsert.email))
      return res.status(400).send({ msg: messages.emailAlreadyExists });

    newUser.user_password = await createHash(userToInsert.user_password);

    let usuario = await userModel.create(newUser);

    let token = await generateToken(usuario);

    return res.status(201).send({ usuario, token });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function login(req, res) {
  try {
    let { email, user_password } = req.body;

    if (!email || !user_password)
      return res.status(400).send({ msg: messages.emailOrPasswordNotProvided });

    let rejectFields = validatePatternsUser({ email, user_password });

    if (rejectFields.length) return res.status(400).send({ msg: rejectFields });

    let user = await userModel.getUserByEmail(email);

    if (!user || !user.pk_user)
      return res.status(400).send({ msg: messages.userNotFound });

    let validPassword = await compareHash(user_password, user);

    if (!validPassword)
      return res.status(400).send({ msg: messages.invalidPassword });

    let token = await generateToken(user);
    return res.send({
      pk_user: user.pk_user,
      first_name: user.first_name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function updateUser(req, res) {
  try {
    let user = req.body;
    let { pk_user } = req.params;

    if (isNaN(Number(pk_user)))
      return res.status(400).send({ msg: messages.invalidRequest });

    if (!user.email)
      return res.status(400).send({ msg: messages.emailOrPasswordNotProvided });

    let rejectFields = validatePatternsUser(user);

    if (rejectFields.length) return res.status(400).send({ msg: rejectFields });

    const emailDuplicated = await userModel.getAllUsersByEmail(user.email);
    if (
      emailDuplicated &&
      emailDuplicated.pk_user &&
      emailDuplicated.pk_user != pk_user
    )
      return res.status(400).send({ msg: messages.emailAlreadyExists });

    const userToUpdate = await userModel.getUser(pk_user);
    if (!userToUpdate || !userToUpdate.pk_user)
      return res.status(400).send({ msg: messages.userNotFound });

    let newUser = {};
    let canUpdate = false;

    for (const key in userToUpdate) {
      if (
        Object.hasOwnProperty.call(userToUpdate, key) &&
        Object.hasOwnProperty.call(user, key)
      ) {
        if (user[key].length <= 0 || user[key].trim().length <= 0) continue;

        if (userToUpdate[key] !== user[key]) {
          newUser[key] = user[key];

          canUpdate = true;
        }
      }
    }

    if (!canUpdate)
      return res.status(400).send({ msg: messages.nothingToUpdate });

    newUser.updated_at = new Date().toISOString();
    
    const pkUpdated = await userModel.updateUserById(pk_user, newUser);

    if (!pkUpdated || pkUpdated <= 0)
      return res.status(400).send({ msg: messages.userNotUpdated });

    return res.status(201).send({ userUpdated: Number(pk_user) });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function inactivateUser(req, res) {
  try {
    let { pk_user } = req.params;

    if (isNaN(Number(pk_user)))
      return res.status(400).send({ msg: messages.invalidRequest });

    const userToDelete = await userModel.getUser(pk_user);
    if (!userToDelete || !userToDelete.pk_user)
      return res.status(400).send({ msg: messages.userNotFound });

    const pkUpdated = await userModel.deleteUserById(pk_user);

    if (!pkUpdated || pkUpdated <= 0)
      return res.status(400).send({ msg: messages.userNotDeleted });

    return res.status(201).send({ userDeleted: Number(pk_user) });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function getUser(req, res) {
  try {
    let { pk_user } = req.params;
    if (isNaN(Number(pk_user)))
      return res.status(400).send({ msg: messages.invalidRequest });

    const usuario = await userModel.getUser(pk_user);

    if (!usuario || !usuario.pk_user)
      return res.send({ msg: messages.userNotFound });

    return res.send(usuario);
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function getUsers(_, res) {
  try {
    const usuarios = await userModel.getUsers();

    if (usuarios.length <= 0) return res.send({ msg: messages.usersNotFound });

    return res.send(usuarios);
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

module.exports = {
  login,
  register,
  updateUser,
  inactivateUser,
  getUser,
  getUsers,
};
