const express = require("express")
const arithmeticCalController = require("../controllers/arithmeticCalcController")

const router = express.Router()
router.get("/:operation/:n1/:n2",arithmeticCalController.getCalculationResult)

module.exports = router
