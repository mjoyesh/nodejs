const express = require("express")
const router = express.Router()
const generatePPDFController = require("../controllers/generatePDF")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/", authMiddleware, generatePPDFController.generatePDF)

module.exports = router