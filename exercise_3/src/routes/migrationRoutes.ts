import express from "express"
import {
  migrateController,
  checkAuthorization,
} from "../controllers/migrationController"

const router = express.Router()

router.get("/migrate", checkAuthorization, migrateController)

module.exports = router
