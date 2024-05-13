import express from "express"
import { readWriteFileSync, readWriteFileASync } from "../controllers/readWriteFileController"

const router = express.Router()
router.get("/read-write-sync", readWriteFileSync)
router.get("/read-write-async", readWriteFileASync)

module.exports = router
