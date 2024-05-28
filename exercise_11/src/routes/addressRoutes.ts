const express = require("express")
const router = express.Router()
const addressController = require("../controllers/addressController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, addressController.addAddress)

module.exports = router
