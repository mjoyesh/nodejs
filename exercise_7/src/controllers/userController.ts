const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
// const jwt = require("jsonwebtoken")
const { sendWelcomeEmail } = require("../services/emailService")
const generateToken = require("../utils/generateToken")

dotenv.config({ path: "./config.env" })

const registerUser = async (req: any, res: any) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const { username, firstName, lastName, profilePicture, age, email, employment } =
    req.body

  const user = new User({
    username,
    firstName,
    lastName,
    profilePicture,
    age,
    email,
    employment,
    password: hashedPassword,
  })

  try {
    const newUser = await user
      .save()
      .then((user: any) => {
        const token = generateToken(user)
        res.cookie("auth-cookie", token, { httpOnly: true })
        res.json({ success: true, token: `Bearer ${token}` })
      })
      .catch((err: any) => console.log(err))
    await sendWelcomeEmail(req.body.email)

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
    await bcrypt
      .compare(req.body.password, user.password)
      .then((isMatch: any) => {
        if (isMatch) {
          const token = generateToken(user)
          res.cookie("auth-cookie", token, { httpOnly: true })
          res.json({ success: true, token: `Bearer ${token}` })
        } else {
          return res.status(400).json({ password: "Password incorrect" })
        }
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
