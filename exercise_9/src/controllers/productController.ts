const Product = require("../models/productSchema")
const serviceAccount = require("../firebase/uploadFileServiceAccountKey.json")
const firebase = require("firebase-admin")
const { v4: uuidv4 } = require("uuid")
const path = require("path")
const mongoose = require("mongoose")

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  })
}

const bucketName = process.env.UPLOAD_FILE_FIREBASE_BUCKET
const bucket = firebase.storage().bucket(bucketName)

const uploadImage = async (file: any) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`
  const fileUpload = bucket.file(fileName)

  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  })

  const [url] = await fileUpload.getSignedUrl({
    action: "read",
    expires: "03-01-2500", // Set an appropriate expiration date
  })

  return url
}

const createProduct = async (req: any, res: any) => {
  const { name, availability, price, inventory, category } = req.body
  const file = req.file

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({ message: "Invalid category ID" })
  }

  if (!file) {
    return res.status(400).json({ message: "Please upload a file" })
  }

  const imageUrl = await uploadImage(file)
  const product = new Product({
    name,
    availability,
    price,
    inventory,
    category,
    image: imageUrl,
  })

  try {
    const newProduct = await product.save()
    res.status(200).json({
      status: "success",
      message: "Product created successfully!",
      data: newProduct,
    })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

const getAllProducts = async (req: any, res: any) => {
  try {
    const { name, category, priceMin, priceMax } = req.query
    const filter: any = {}

    if (name) {
      filter.name = { $regex: name, $options: "i" } // i stand for case-insensitive search
    }

    if (category) {
      filter.category = category
    }

    if (priceMin) {
      filter.price = { ...filter.price, $gte: Number(priceMin) } // greater than equal to
    }

    if (priceMax) {
      filter.price = { ...filter.price, $lte: Number(priceMax) } // less than equal to
    }
    const products = await Product.find(filter).populate("category", "name")
    res.status(200).json({
      status: "success",
      data: products,
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const getProductById = async (req: any, res: any) => {
  let product
  try {
    product = await Product.findById(req.params.id).populate("category", "name")
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
        data: product,
      })
    }
    res.status(200).json({
      data: product,
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }

  // res.product = product
  // next()
}

const updateProduct = async (req: any, res: any) => {
  const product = await Product.findById(req.params.id)
  if (req.body.name != null) {
    product.name = req.body.name
  }
  if (req.body.availability != null) {
    product.availability = req.body.availability
  }
  if (req.body.price != null) {
    product.price = req.body.price
  }
  if (req.body.inventory != null) {
    product.inventory = req.body.inventory
  }
  if (req.body.category != null) {
    product.category = req.body.category
  }
  if (req.file) {
    product.image = req.file.path
  }

  try {
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

const deleteProduct = async (req: any, res: any) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully!",
    })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}
