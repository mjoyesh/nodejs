const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

dotenv.config({ path: "./config.env" })

const registerUser = async (req: any, res: any) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  const user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  })

  try {
    const newUser = await user.save()

    res.status(200).json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const loginUser = async (req: any, res: any) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found!",
      })
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Password!",
      })
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: 24 * 60 * 60 * 1000, //expires in 24 hours
    })

    res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
      token,
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const getUserProfile = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(200).json({
        status: "fail",
        message: "User not found!",
      })
    }
    res.status(200).json({
      data: user,
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const updateUserProfile = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(200).json({
        message: "User not found!",
      })
    }
    if (req.body.name) {
      user.name = req.body.name
    }
    if (req.body.email) {
      user.email = req.body.email
    }
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10)
    }
    const updatedUser = await user.save()
    res.status(200).json({
      status: "success",
      message: "User updated successfully!",
      data: updatedUser,
    })
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
}
