const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const uploadLogController = require("../controllers/uploadLogController")

router.get("/uploadlogs", authMiddleware, uploadLogController.getUploadLogs)

module.exports = router