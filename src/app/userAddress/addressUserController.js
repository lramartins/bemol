const addressUserModel = require("./addressUserModel");
const userModel = require("./../user/userModel");
const messages = require("../../helpers/messages");
const {
  validatePatternsAddressUser,
} = require("../../helpers/validatePatterns");

async function register(req, res) {
  try {
    let addressUserToInsert = req.body;
    let newAddressUser = {};

    let { fk_user, fk_address, address_number, complement } =
      addressUserToInsert;

    if (isNaN(fk_user))
      return res.status(400).send({ msg: messages.invalidRequest });

    if (!address_number.trim() && !complement.trim())
      return res
        .status(400)
        .send({ msg: messages.AddressNumberOrComplementNotProvided });

    if (!fk_user.trim() || fk_user.trim() <= 0)
      return res.status(400).send({ msg: messages.userNotProvided });

    const userReferenced = await userModel.getUser(fk_user);

    if (!userReferenced || !userReferenced.pk_user)
      return res.status(400).send({ msg: messages.userNotFound });

    if (!fk_address || fk_address <= 0) {
      for (const key in addressUserToInsert) {
        if (Object.hasOwnProperty.call(addressUserToInsert, key)) {
          if (
            addressUserToInsert[key].length <= 0 ||
            addressUserToInsert[key].trim().length <= 0
          ) {
            switch (key) {
              case "zipcode":
                return res
                  .status(400)
                  .send({ msg: messages.zipCodeNotProvided });
              case "street":
                return res
                  .status(400)
                  .send({ msg: messages.streetNotProvided });
              case "district":
                return res
                  .status(400)
                  .send({ msg: messages.districtNotProvided });
              case "city":
                return res.status(400).send({ msg: messages.cityNotProvided });
              case "state":
                return res.status(400).send({ msg: messages.stateNotProvided });
              case "country":
                return res
                  .status(400)
                  .send({ msg: messages.countryNotProvided });
              default:
                continue;
            }
          } else {
            newAddressUser[key] = addressUserToInsert[key].trim();
          }
        }
      }
    } else {
      for (const key in addressUserToInsert) {
        if (Object.hasOwnProperty.call(addressUserToInsert, key)) {
          newAddressUser[key] = addressUserToInsert[key].trim();
        }
      }
    }

    let rejectFields = validatePatternsAddressUser(newAddressUser);

    if (rejectFields.length) return res.status(400).send({ msg: rejectFields });

    let newAddressUserCreated = await addressUserModel.create(newAddressUser);

    return res.status(201).send({ newAddressUserCreated });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function updateAddressUser(req, res) {
  try {
    let addressUser = req.body;
    let { pk_address_user } = req.params;
    let newAddressUser = {};

    if (
      isNaN(Number(pk_address_user)) ||
      !Number.isInteger(Number(pk_address_user))
    )
      return res.status(400).send({ msg: messages.invalidRequest });

    let rejectFields = validatePatternsAddressUser(addressUser);

    if (rejectFields.length) return res.status(400).send({ msg: rejectFields });

    const addressToUpdate = await addressUserModel.getAddressUser(
      pk_address_user
    );
    if (!addressToUpdate || !addressToUpdate.pk_address_user)
      return res.status(400).send({ msg: messages.addressUserNotFound });

    let canUpdate = false;

    for (const key in addressToUpdate) {
      if (
        Object.hasOwnProperty.call(addressToUpdate, key) &&
        Object.hasOwnProperty.call(addressUser, key)
      ) {
        if (
          String(addressUser[key]).length <= 0 ||
          String(addressUser[key]).trim().length <= 0
        )
          continue;

        if (addressToUpdate[key] != addressUser[key]) {
          newAddressUser[key] = String(addressUser[key]).trim();

          canUpdate = true;
        }
      }
    }

    if (!canUpdate)
      return res.status(400).send({ msg: messages.nothingToUpdate });

    newAddressUser.updated_at = new Date().toISOString();

    const pkUpdated = await addressUserModel.updateAddressUserById(
      pk_address_user,
      newAddressUser
    );

    if (!pkUpdated || pkUpdated <= 0)
      return res.status(400).send({ msg: messages.addressUserNotUpdated });

    return res
      .status(201)
      .send({ addressUserUpdated: Number(pk_address_user) });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function inactivateAddressUser(req, res) {
  try {
    let { pk_address_user } = req.params;

    if (
      isNaN(Number(pk_address_user)) ||
      !Number.isInteger(Number(pk_address_user))
    )
      return res.status(400).send({ msg: messages.invalidRequest });

    const addressUserToDelete = await addressUserModel.getAddressUser(
      pk_address_user
    );
    if (!addressUserToDelete || !addressUserToDelete.pk_address_user)
      return res.status(400).send({ msg: messages.addressUserNotFound });

    const pkUpdated = await addressUserModel.deleteAddressUserById(
      pk_address_user
    );

    if (!pkUpdated || pkUpdated <= 0)
      return res.status(400).send({ msg: messages.addressUserNotDeleted });

    return res
      .status(201)
      .send({ addressUserDeleted: Number(pk_address_user) });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function getAddressUser(req, res) {
  try {
    let { pk_address_user } = req.params;
    if (
      isNaN(Number(pk_address_user)) ||
      !Number.isInteger(Number(pk_address_user))
    )
      return res.status(400).send({ msg: messages.invalidRequest });

    const addressUser = await addressUserModel.getAddressUser(pk_address_user);

    if (!addressUser || !addressUser.pk_address_user)
      return res.send({ msg: messages.addressUserNotFound });

    return res.send(addressUser);
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function getAddressesUser(req, res) {
  try {
    let { pk_user } = req.params;

    if (isNaN(Number(pk_user)) || !Number.isInteger(Number(pk_user)))
      return res.status(400).send({ msg: messages.invalidRequest });

    const addressUser = await addressUserModel.getAllAddressUserByFkUser(
      pk_user
    );

    if (addressUser.length <= 0)
      return res.send({ msg: messages.addressesUserNotFound });

    return res.send(addressUser);
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

module.exports = {
  register,
  updateAddressUser,
  inactivateAddressUser,
  getAddressUser,
  getAddressesUser,
};
