const pg = require("../../config/database");

async function create(addressUser) {
  const res = await pg("tbl_address_user").insert(addressUser, ["pk_address_user"]);

  return res[0];
}

async function updateAddressUserById(pk_address_user, updateObj) {
  const res = await pg("tbl_address_user")
    .update(updateObj, ["pk_address_user"])
    .where({ pk_address_user, active: true });

  return res[0];
}

async function deleteAddressUserById(pk_address_user) {
  const res = await pg("tbl_address_user")
    .update({ active: false }, ["pk_address_user"])
    .where({ pk_address_user, active: true });

  return res[0];
}

async function getAddressUser(pk_address_user) {
  const res = await pg("tbl_address_user")
    .where({ pk_address_user, active: true })
    .select(
      "pk_address_user",
      "fk_user",
      "fk_address",
      "zipcode",
      "street",
      "district",
      "city",
      "state",
      "country",
      "address_number",
      "complement",
    );

  return res[0];
}

async function getAllAddressUserByFkUser(fk_user) {
  const res = await pg("tbl_address_user")
    .where({ fk_user })
    .select(
      "pk_address_user",
      "fk_user",
      "fk_address",
      "zipcode",
      "street",
      "district",
      "city",
      "state",
      "country",
      "address_number",
      "complement",
      "active",
    );

  return res;
}

module.exports = {
  create,
  updateAddressUserById,
  deleteAddressUserById,
  getAddressUser,
  getAllAddressUserByFkUser,
};
