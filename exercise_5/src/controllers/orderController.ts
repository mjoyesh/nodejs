const Order = require("../models/orderSchema")
const Cart = require("../models/cartSchema")

const placeOrder = async (req: any, res: any) => {
  const userId = req.userId

  try {
    const cart = await Cart.findOne({
      user: userId,
    }).populate("products.product")

    if (!cart) {
      return res.status(404).json({
        status: "Fail",
        message: "Cart not found",
      })
    }

    const products = cart.products.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
    }))

    const totalPrice = cart.products.reduce(
      (total: any, item: any) => total + item.product.price * item.quantity,
      0
    )
    const order = new Order({
      user: userId,
      products,
      totalPrice,
    })
    await order.save()
    await Cart.findOneAndDelete({ user: userId })
    res.status(201).json({
      message: "Order places successfully!",
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

const getOrder = async (req, res) => {
  const userId = req.userId
  try {
    const orders = await Order.find({ user: userId }).populate(
      "products.product",
      "name price"
    )
    res.status(200).json({
      data: orders,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
