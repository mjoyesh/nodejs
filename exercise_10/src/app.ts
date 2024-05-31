const express = require("express")
const path = require("path")
const cors = require('cors')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const userRoutes = require("./routes/userRoutes")
const homepageRoutes = require("./routes/homepageRoutes")
const configurationRoutes = require("./routes/configurationRoutes")

const app = express()
require("./config/passport")(passport)
app.use(passport.initialize())
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use("/auth", userRoutes)
app.use("/configuration", configurationRoutes)
app.use("/homepage", homepageRoutes)

app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true,
}));

module.exports = app
