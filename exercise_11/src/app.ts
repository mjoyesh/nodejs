const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const flash = require("connect-flash")
const userRoutes = require("./routes/userRoutes")
const addressRoutes = require("./routes/addressRoutes")

const app = express()
require("./config/passport")(passport)
app.use(passport.initialize())
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use("/auth", userRoutes)
app.use("/addresses", addressRoutes)

module.exports = app
