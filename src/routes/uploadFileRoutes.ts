import express from "express"
import { migrateController } from "../controllers/uploadFileController"

const router = express.Router()
router.post("/upload-file", migrateController)

module.exports = router
