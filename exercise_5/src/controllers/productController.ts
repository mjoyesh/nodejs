const Product = require("../models/productSchema")
const serviceAccount = require("../firebase/uploadFileServiceAccountKey.json")
const firebase = require("firebase-admin");
import { NextFunction } from "express"

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  })
}

const createProduct = async (req: any, res: any) => {
  const storageRef = firebase.storage().ref();
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  const imageRef = storageRef.child("images/" + file.originalname);
  const snapshot = await imageRef.put(file.buffer);

  const imageUrl = await snapshot.ref.getDownloadURL();

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category,
    image: imageUrl,
  });

  try {
    const newProduct = await product.save();
    res.status(200).json({
      status: "success",
      message: "Product created successfully!",
      data: newProduct
    })
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

const getAllProducts = async(req: any, res: any) => {
  try {
    const products = await Product.find().populate("category", "name")
    res.status(200).json({
      status: "success",
      data: products
    })
  } catch(err: any) {
    res.status(500).json({
      error: err.message
    })
  }
}

const getProductById = async(req: any, res: any, next: NextFunction) => {
  let product
  try {
    product = await Product.findById(req.params.id).populate("category", "name")
    if(!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
        data: product
      })
    }
    res.status(200).json({
      data: product
    })
  } catch(err: any) {
    res.status(500).json({
      error: err.message
    })
  }

  // res.product = product
  // next()
}

const updateProduct = async(req: any, res: any) => {
  const product = await Product.findById(req.params.id)
  if (req.body.name != null) {
    product.name = req.body.name;
  }
  if (req.body.description != null) {
    product.description = req.body.description;
  }
  if (req.body.price != null) {
    product.price = req.body.price;
  }
  if (req.body.quantity != null) {
    product.quantity = req.body.quantity;
  }
  if (req.body.category != null) {
    product.category = req.body.category;
  }
  if (req.file) {
    product.image = req.file.path;
  }

  try {
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

const deleteProduct = async(req: any, res: any) => {
  try {
    const product = await Product.findById(req.params.id)
    await product.remove()
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully!"
    })
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
}