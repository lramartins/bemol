const addressModel = require("./addressModel");
const messages = require("../../helpers/messages");
const { validatePatternsAddress } = require("../../helpers/validatePatterns");

async function register(req, res) {
  try {
    let addressToInsert = req.body;
    let newAddress = {};

    for (const key in addressToInsert) {
      if (Object.hasOwnProperty.call(addressToInsert, key)) {
        if (
          addressToInsert[key].length <= 0 ||
          addressToInsert[key].trim().length <= 0
        ) {
          switch (key) {
            case "zipCode":
              return res.status(400).send({ msg: messages.zipCodeNotProvided });
            case "street":
              return res.status(400).send({ msg: messages.streetNotProvided });
            case "district":
              return res
                .status(400)
                .send({ msg: messages.districtNotProvided });
            case "city":
              return res.status(400).send({ msg: messages.cityNotProvided });
            case "state":
              return res.status(400).send({ msg: messages.stateNotProvided });
            case "country":
              return res.status(400).send({ msg: messages.countryNotProvided });
            default:
              continue;
          }
        } else {
          newAddress[key] = addressToInsert[key].trim();
        }
      }
    }

    let rejectFields = validatePatternsAddress(newAddress);

    if (rejectFields.length) return res.status(400).send({ msg: rejectFields });

    if (await addressModel.getAllAddressesByZipCode(addressToInsert.zipcode))
      return res.status(400).send({ msg: messages.zipCodeAlreadyExists });

    let address = await addressModel.create(newAddress);

    return res.status(201).send({ address });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function updateAddress(req, res) {
  try {
    let address = req.body;
    let { pk_address } = req.params;
    let newAddress = {};

    if (isNaN(Number(pk_address)))
      return res.status(400).send({ msg: messages.invalidRequest });

    let rejectFields = validatePatternsAddress(address);

    if (rejectFields.length) return res.status(400).send({ msg: rejectFields });

    const duplicatedAddress = await addressModel.getAllAddressesByZipCode(address.zipcode);
    if(duplicatedAddress && duplicatedAddress.pk_address  && duplicatedAddress.pk_address != pk_address)
      return res.status(400).send({ msg: messages.zipCodeAlreadyExists });


    const addressToUpdate = await addressModel.getAddress(pk_address);
    if (!addressToUpdate || !addressToUpdate.pk_address)
      return res.status(400).send({ msg: messages.addressNotFound });

    let canUpdate = false;

    for (const key in addressToUpdate) {
      if (
        Object.hasOwnProperty.call(addressToUpdate, key) &&
        Object.hasOwnProperty.call(address, key)
      ) {
        if (address[key].length <= 0 || address[key].trim().length <= 0)
          continue;

        if (addressToUpdate[key] !== address[key]) {
          newAddress[key] = address[key].trim();

          canUpdate = true;
        }
      }
    }

    if (!canUpdate)
      return res.status(400).send({ msg: messages.nothingToUpdate });

    const pkUpdated = await addressModel.updateAddressById(
      pk_address,
      newAddress
    );

    if (!pkUpdated || pkUpdated <= 0)
      return res.status(400).send({ msg: messages.addressNotUpdated });

    return res.status(201).send({ addressUpdated: Number(pk_address) });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function inactivateAddress(req, res) {
  try {
    let { pk_address } = req.params;

    if (isNaN(Number(pk_address)))
      return res.status(400).send({ msg: messages.invalidRequest });

    const addressToDelete = await addressModel.getAddress(pk_address);
    if (!addressToDelete || !addressToDelete.pk_address)
      return res.status(400).send({ msg: messages.addressNotFound });

    const pkUpdated = await addressModel.deleteAddressById(pk_address);

    if (!pkUpdated || pkUpdated <= 0)
      return res.status(400).send({ msg: messages.addressNotDeleted });

    return res.status(201).send({ addressDeleted: Number(pk_address) });
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function getAddress(req, res) {
  try {
    let { pk_address } = req.params;
    if (isNaN(Number(pk_address)))
      return res.status(400).send({ msg: messages.invalidRequest });

    const address = await addressModel.getAddress(pk_address);

    if (!address || !address.pk_address)
      return res.send({ msg: messages.addressNotFound });

    return res.send(address);
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

async function getAddresses(_, res) {
  try {
    const address = await addressModel.getAddresses();

    if (address.length <= 0)
      return res.send({ msg: messages.addressesNotFound });

    return res.send(address);
  } catch (error) {
    return res.status(500).send({ msg: messages.uncaughtError, err: error });
  }
}

module.exports = {
  register,
  updateAddress,
  inactivateAddress,
  getAddress,
  getAddresses,
};