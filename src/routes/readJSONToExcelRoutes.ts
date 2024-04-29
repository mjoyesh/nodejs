import express from "express"
import { convertJSONtoExcel } from "../controllers/readJSONToExcelController"

const router = express.Router()
router.get("/json-to-excel", convertJSONtoExcel)

module.exports = router
