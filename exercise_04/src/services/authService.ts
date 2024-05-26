const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const User = require("../models/userSchema")

dotenv.config({ path: "./config.env" })

const registerUser = async(userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  const user = new User({
    username: userData.username,
    password: hashedPassword
  })

  await user.save()
}

const loginUser = async(userData: any) => {
  const user = await User.findOne({ username: userData.username })
  if(!user) {
    throw new Error("User not found!")
  }

  const isPasswordValid = await bcrypt.compare(userData.password, user.password)
  if(!isPasswordValid) {
    throw new Error("Invalid Password!")
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: 24 * 60 * 60 * 1000 //expires in 24 hours
  })

  return token
}

module.exports = {
  registerUser,
  loginUser
}