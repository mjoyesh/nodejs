import express from "express"
import { getCalculationResult } from "../controllers/arithmeticCalcController"

const router = express.Router()
router.get("/:operation/:n1/:n2", getCalculationResult)

module.exports = router
