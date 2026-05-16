const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware.js");
const {uploadFile} = require("../controllers/uploadController.js");

router.post("/", upload.single("file"), uploadFile);

module.exports = router;