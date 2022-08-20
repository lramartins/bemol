const addressController = require("./addressUserController");

module.exports = [
  {
    verb: "post",
    controllerFunction: addressController.register,
    endpoint: "/address/user/register",
  },
  {
    verb: "put",
    controllerFunction: addressController.updateAddressUser,
    endpoint: "/address/user/update/:pk_address_user",
  },
  {
    verb: "delete",
    controllerFunction: addressController.inactivateAddressUser,
    endpoint: "/address/user/delete/:pk_address_user",
  },
  {
    verb: "get",
    controllerFunction: addressController.getAddressUser,
    endpoint: "/address/user/:pk_address_user",
  },
  {
    verb: "get",
    controllerFunction: addressController.getAddressesUser,
    endpoint: "/address/user/user/:pk_user",
  },
];
