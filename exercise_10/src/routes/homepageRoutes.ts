const express = require("express")
const router = express.Router()
const homepageController = require("../controllers/homepageController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/", (req: any, res: any) => res.render("homepage"))
router.get("/displayProducts", authMiddleware, homepageController.displayProducts)
module.exports = router
