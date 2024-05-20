const express = require("express")
const router = express.Router()
const orderController = require("../controllers/orderController")
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/place", authMiddleware, orderController.placeOrder)
router.get("/", authMiddleware, orderController.getOrders)

module.exports = router
