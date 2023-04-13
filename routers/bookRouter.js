const router = require("express").Router();
const multer = require("multer");
const bookController = require("../controllers/bookController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");

const upload = multer({ storage: multer.diskStorage({}) });

router.get("/", bookController.getAllBooks);
router.post(
  "/",
  protectAuth,
  roleAccess("admin"),
  upload.single("cover"),
  bookController.addBook
);
router.get("/:id", bookController.getOneBook);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  upload.single("cover"),
  bookController.updateBook
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  bookController.deleteBook
);

module.exports = router;
