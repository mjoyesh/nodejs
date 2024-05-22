const express = require("express")
const router = express.Router()
const {
  sendPromotionalEmailController,
} = require("../controllers/promotionalEmailController")

router.post("/", sendPromotionalEmailController)

module.exports = router
