const mongoose = require("mongoose")
const Cart = require("../models/cartSchema")
const Product = require("../models/productSchema")

const addToCart = async (req: any, res: any) => {
  const { productId, quantity } = req.body
  const userId = req.userId

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [
          {
            product: productId,
            quantity: quantity || 1,
          },
        ],
      })
      await cart.save()
    } else {
      const productIndex = cart.products.findIndex(
        (item: any) => item.product.toString() === productId
      )

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity || 1
      } else {
        cart.products.push({ product: productId, quantity: quantity || 1 })
      }

      await cart.save()
    }
    res.status(200).json({
      status: "success",
      message: "Product added to cart successfully!",
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const removeFromCart = async (req: any, res: any) => {
  const { productId } = req.body
  const userId = req.userId

  try {
    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const productIndex = cart.products.findIndex(
      (item: any) => item.product.toString() === productId
    )

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" })
    }

    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity--
    } else {
      cart.products.splice(productIndex, 1)
    }

    await cart.save()

    res.status(200).json({ message: "Product removed from cart successfully" })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const getCart = async (req: any, res: any) => {
  const userId = req.userId

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "name price"
    )

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    res.status(200).json({
      data: cart,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getCart,
  removeFromCart,
  addToCart,
}
