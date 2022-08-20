const userController = require("./userController");

module.exports = [
  {
    verb: "post",
    controllerFunction: userController.login,
    endpoint: "/user/login",
    public: true,
  },
  {
    verb: "post",
    controllerFunction: userController.register,
    endpoint: "/user/register",
    public: true,
  },
  {
    verb: "put",
    controllerFunction: userController.updateUser,
    endpoint: "/user/update/:pk_user",
  },
  {
    verb: "delete",
    controllerFunction: userController.inactivateUser,
    endpoint: "/user/delete/:pk_user",
  },
  {
    verb: "get",
    controllerFunction: userController.getUser,
    endpoint: "/user/:pk_user",
  },
  {
    verb: "get",
    controllerFunction: userController.getUsers,
    endpoint: "/user",
  },
];
