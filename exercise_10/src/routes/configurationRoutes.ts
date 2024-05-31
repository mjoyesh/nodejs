const express = require("express")
const router = express.Router()
const configureController = require("../controllers/configureController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/", (req: any, res: any) => res.render("configuration"))
router.post("/", authMiddleware, configureController.configure)
module.exports = router
