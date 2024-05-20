const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cartController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/add", authMiddleware, cartController.addToCart)
router.post("/remove", authMiddleware, cartController.removeFromCart)
router.get("/", authMiddleware, cartController.getCart)

module.exports = router
