const router = require("express").Router({ mergeParams: true });
const uploadController = require("../controllers/uploadController");
const protectAuth = require("../middleware/protectAuth");

router.get("/", uploadController.getAllUploads);
router.post("/", protectAuth, uploadController.addUpload);
router.get("/:id", uploadController.getOneUpload);
router.patch("/:id", protectAuth, uploadController.updateUpload);
router.delete("/:id", protectAuth, uploadController.deleteUpload);

module.exports = router;
