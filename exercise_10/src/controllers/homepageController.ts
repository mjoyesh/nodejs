const Product = require("../models/productSchema")

const displayProducts = async (req: any, res: any) => {
  try {
    const products = await Product.find()
    res.status(200).json({
      status: "success",
      data: products
    })
  } catch (error) {
    console.error(error)
    res.status(500).send("An error occurred while fetching products.")
  }
}

module.exports = { displayProducts }
