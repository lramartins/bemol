const pg = require("../../config/database");

async function create(usuario) {
  const res = await pg("tbl_users").insert(usuario, [
    "pk_user",
    "first_name",
    "email",
  ]);
  return res[0];
}

async function updateUserById(pk_user, updateObj) {
  const res = await pg("tbl_users")
    .update(updateObj, ["pk_user"])
    .where({ pk_user, active: true });

  return res[0];
}

async function deleteUserById(pk_user) {
  const res = await pg("tbl_users")
    .update({ active: false }, ["pk_user"])
    .where({ pk_user, active: true });

  return res[0];
}

async function getUser(pk_user) {
  const res = await pg("tbl_users")
    .where({ pk_user, active: true })
    .select(
      "pk_user",
      "first_name",
      "last_name",
      "email",
      "created_at",
      "updated_at"
    );

  return res[0];
}

async function getUsers() {
  const res = await pg("tbl_users")
    .where({ active: true })
    .select(
      "pk_user",
      "first_name",
      "last_name",
      "email",
      "created_at",
      "updated_at"
    );

  return res;
}

async function getUserByEmail(email) {
  const res = await pg("tbl_users")
    .where({ email, active: true })
    .select(
      "pk_user",
      "first_name",
      "last_name",
      "email",
      "user_password",
      "created_at",
      "updated_at"
    );

  return res[0];
}

async function getAllUsersByEmail(email) {
  const res = await pg("tbl_users")
    .where({ email })
    .select(
      "pk_user",
      "first_name",
      "last_name",
      "email",
      "user_password",
      "created_at",
      "updated_at"
    );

  return res[0];
}

module.exports = {
  create,
  updateUserById,
  deleteUserById,
  getUser,
  getUserByEmail,
  getAllUsersByEmail,
  getUsers,
};
