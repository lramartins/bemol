const addressController = require("./addressController");

module.exports = [
    {
    verb: "post",
    controllerFunction: addressController.register,
    endpoint: "/address/register",
  },
  {
    verb: "put",
    controllerFunction: addressController.updateAddress,
    endpoint: "/address/update/:pk_address",
  },
  {
    verb: "delete",
    controllerFunction: addressController.inactivateAddress,
    endpoint: "/address/delete/:pk_address",
  },
  {
    verb: "get",
    controllerFunction: addressController.getAddress,
    endpoint: "/address/:pk_address",
  },
  {
    verb: "get",
    controllerFunction: addressController.getAddresses,
    endpoint: "/address",
  },
  {
    verb: "get",
    controllerFunction: addressController.getAddressByZipCode,
    endpoint: "/address/zipcode/:zipcode",
  },
];
