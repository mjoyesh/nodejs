const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const passport = require("passport")

dotenv.config({ path: "./config.env" })

const passportAuthentication = passport.authenticate("jwt", { session: false })

module.exports = passportAuthentication
