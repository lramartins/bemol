const pg = require("../../config/database");

async function create(address) {
  const res = await pg("tbl_address").insert(address, ["pk_address"]);

  return res[0];
}

async function updateAddressById(pk_address, updateObj) {
  const res = await pg("tbl_address")
    .update(updateObj, ["pk_address"])
    .where({ pk_address, active: true });

  return res[0];
}

async function deleteAddressById(pk_address) {
  const res = await pg("tbl_address")
    .update({ active: false }, ["pk_address"])
    .where({ pk_address, active: true });

  return res[0];
}

async function getAddress(pk_address) {
  const res = await pg("tbl_address")
    .where({ pk_address, active: true })
    .select(
      "pk_address",
      "zipcode",
      "street",
      "district",
      "city",
      "state",
      "country"
    );

  return res[0];
}

async function getAddresses() {
  const res = await pg("tbl_address")
    .where({ active: true })
    .select(
      "pk_address",
      "zipcode",
      "street",
      "district",
      "city",
      "state",
      "country"
    );

  return res;
}

async function getAddressByZipCode(zipcode) {
  const res = await pg("tbl_address")
    .where({ zipcode, active: true })
    .select(
      "pk_address",
      "zipcode",
      "street",
      "district",
      "city",
      "state",
      "country"
    );

  return res[0];
}

async function getAllAddressesByZipCode(zipcode) {
  const res = await pg("tbl_address")
    .where({ zipcode })
    .select(
      "pk_address",
      "zipcode",
      "street",
      "district",
      "city",
      "state",
      "country",
      "active"
    );

  return res[0];
}

module.exports = {
  create,
  updateAddressById,
  deleteAddressById,
  getAddress,
  getAddressByZipCode,
  getAllAddressesByZipCode,
  getAddresses,
};
