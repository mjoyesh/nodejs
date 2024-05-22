const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const userRoutes = require("./routes/userRoutes")
const secureRoutes = require('./routes/secure');
const generatePDFRoutes = require("./routes/generatePDFRoutes")

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(passport.initialize());

app.use("/auth", userRoutes)
app.use('/secure', secureRoutes);

module.exports = app
