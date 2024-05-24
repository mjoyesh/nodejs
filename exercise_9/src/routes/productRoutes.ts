const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const authMiddleware = require("../middleware/authMiddleware")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

// Create uploads directory if it doesn't exist
// const uploadDir = path.join(__dirname, '..', 'products');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

const storage = multer.memoryStorage()

const upload = multer({ storage })

router.get("/", authMiddleware, productController.getAllProducts)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  productController.createProduct
)
router.get("/:id", authMiddleware, productController.getProductById)
router.put("/:id", authMiddleware, productController.updateProduct)
router.delete("/:id", authMiddleware, productController.deleteProduct)

module.exports = router
