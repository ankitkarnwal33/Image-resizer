const express = require("express");
const {
  uploadImage,
  reduceSize,
  downloadImage,
} = require("../controller/imagesController");
const router = express.Router();

const multer = require("multer");
const authenticate = require("../middleware/authenticate");

const upload = multer({
  dest: "uploads/",
});

router.post("/upload-image", upload.single("file"), uploadImage);
router.put("/resizeImage", reduceSize);
router.get("/download", downloadImage);

const imageRouter = router;
module.exports = imageRouter;
