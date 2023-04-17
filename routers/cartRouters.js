const router = require("express").Router({ mergeParams: true });
const cartController = require("../controllers/cartController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");

router.get("/", protectAuth, roleAccess("admin"), cartController.getAllCarts);
router.get("/myCart", protectAuth, cartController.getMyCart);
router.post("/", protectAuth, roleAccess("admin"), cartController.createCart);
router.get("/:id", protectAuth, cartController.getOneCart);
router.patch(
  "/:id",
  protectAuth,

  cartController.updateCart
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  cartController.deleteCart
);

module.exports = router;
