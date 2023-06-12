const router = require("express").Router({ mergeParams: true });
const requestController = require("../controllers/requestController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");

router.get(
  "/",
  protectAuth,
  roleAccess("admin"),
  requestController.getAllRequests
);
router.post(
  "/",
  protectAuth,
  roleAccess("admin"),
  requestController.addRequest
);
router.get(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  requestController.getOneRequest
);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  requestController.updateRequest
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  requestController.deleteRequest
);

module.exports = router;
