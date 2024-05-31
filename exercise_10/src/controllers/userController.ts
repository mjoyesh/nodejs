const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
// const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const { sendVerificationEmail } = require("../services/emailService")
const generateToken = require("../utils/generateToken")

dotenv.config({ path: "./config.env" })

const registerUser = async (req: any, res: any) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const {
    username,
    firstName,
    lastName,
    profilePicture,
    age,
    email,
    employment,
  } = req.body
  const verificationToken = uuidv4()
  const user = new User({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    verificationToken,
  })

  try {
    const newUser = await user
      .save()
      .then(async(user: any) => {
        // await sendWelcomeEmail(req.body.email)
        await sendVerificationEmail(req.body.email, verificationToken)
      })
      .catch((err: any) => console.log(err))
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

const verifyUser = async (req: any, res: any) => {
  try {
    const { token } = req.query
    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" })
    }

    user.isVerified = true
    user.verificationToken = null
    await user.save()

    res.status(200).json({ message: "Email verified successfully" })
  } catch (error) {
    res.status(500).json({ message: error })
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
    if (user.isVerified) {
      await bcrypt
        .compare(req.body.password, user.password)
        .then((isMatch: any) => {
          if (isMatch) {
            const token = generateToken(user)
            res.cookie("auth-cookie", token, { httpOnly: true })
            res.json({ success: true, token: `Bearer ${token}` })
          } else {
            return res.status(401).json({ password: "Password incorrect" })
          }
        })
    } else {
      res
        .status(401)
        .json({ message: "User not verified. Please verify your email!" })
    }
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
}
