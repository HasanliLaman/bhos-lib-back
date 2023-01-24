const router = require("express").Router();
const bookController = require("../controllers/bookController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");

router.get("/", bookController.getAllBooks);
router.post("/", bookController.addBook);
router.get("/:id", bookController.getOneBook);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  bookController.updateBook
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  bookController.deleteBook
);

module.exports = router;
