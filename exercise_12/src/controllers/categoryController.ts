const Category = require("../models/categorySchema")
import { NextFunction, Request, Response } from "express"

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().select("name description")
    res.status(200).json({
      status: "success",
      data: categories,
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    })

    const newCategory = await category.save()
    res.status(200).json({
      status: "success",
      data: newCategory,
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const getCategoryById = async (req: Request, res: any, next: NextFunction) => {
  try {
    let category = await Category.findById(req.params.id).select(
      "name description"
    )
    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      })
    }
    res.status(200).json({
      data: category,
    })

    // res.category = category
    // next()
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const updateCategory = async (req: Request, res: any) => {
  try {
    const category = await Category.findById(req.params.id)

    if (req.body.name) {
      category.name = req.body.name
    }
    if (req.body.description) {
      category.description = req.body.description
    }
    const updateCategory = await category.save()
    res.status(200).json({
      status: "success",
      data: updateCategory,
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const deleteCategory = async (req: Request, res: any) => {
  try {
    const category = await Category.findById(req.params.id)
    if (category) {
      await category.deleteOne()
      res.status(200).json({
        status: "success",
        message: "Category deleted successfully!",
      })
    } else {
      return res.status(404).json({ message: "Category not found" })
    }
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    })
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
}
