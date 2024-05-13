const express = require("express")
const router = express.Router()
const multer = require("multer")
const fs = require('fs');
const path = require('path')
const authMiddleware = require("../middleware/authMiddleware")
const fileController = require("../controllers/fileController")

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, uploadDir)
  },
  fileName: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage })

router.post("/upload", authMiddleware, upload.single("file"), fileController.uploadFile)
router.delete("/delete/:id", authMiddleware, fileController.deleteFile)
router.get("/download/:id", authMiddleware, fileController.downloadFile)

module.exports = router