const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddleware")
// const secureController = require("../controllers/secureController")

router.get("/register", (req: any, res: any) => res.render("register"))
router.post("/register", userController.registerUser)
router.get("/login", (req: any, res: any) => res.render("login"))
router.post("/login", userController.loginUser)
router.get('/verify-email', userController.verifyUser)
router.get('/profile', authMiddleware, userController.getUserProfile)
router.put('/profile', authMiddleware, userController.updateUserProfile)
// router.get("/secure", authMiddleware, secureController.getProtectedData)

module.exports = router
