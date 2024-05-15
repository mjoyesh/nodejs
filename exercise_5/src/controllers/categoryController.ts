const Category = require("../models/categorySchema")

exports.getAllCatgories = async(req, res) => {
  try {
    const categories = await Category.find().select("name description")
    res.status(200).json({
      status: "success",
      data: categories
    })
  } catch(err) {
    res.status(500).json({
      error: err.message
    })
  }
}

exports.createCategory = async(req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      description: req.body.description
    })

    const newCategory = await category.save()
    res.status(200).json({
      status: "success",
      data: newCategory
    })
  } catch(err) {
    res.status(500).json({
      error: err.message
    })
  }
}

