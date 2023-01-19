const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");

// Auth
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// User
router.get("/", protectAuth, roleAccess("admin"), userController.getAllUsers);
router.post("/", protectAuth, roleAccess("admin"), userController.addUser);
router.get("/:id", protectAuth, roleAccess("admin"), userController.getOneUser);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  userController.updateUser
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  userController.deleteUser
);

module.exports = router;
