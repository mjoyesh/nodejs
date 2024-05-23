const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const userRoutes = require("./routes/userRoutes")

const app = express()
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/auth", userRoutes)

module.exports = app
