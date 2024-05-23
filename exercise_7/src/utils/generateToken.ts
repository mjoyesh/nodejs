const jwt = require("jsonwebtoken")

const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 60 * 60,
    }
  )
}

module.exports = generateToken
