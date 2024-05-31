const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/register", (req: any, res: any) => res.render("register"))
router.post("/register", userController.registerUser)
router.get("/login", (req: any, res: any) => res.render("login"))
router.post("/login", userController.loginUser)
router.get("/verify-email", userController.verifyUser)
module.exports = router
