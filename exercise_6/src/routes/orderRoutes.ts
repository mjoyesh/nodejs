const express = require("express")
const router = express.Router()
const orderController = require("../controllers/orderController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/place", authMiddleware, orderController.placeOrder)
router.get("/", authMiddleware, orderController.getOrder)

module.exports = router
