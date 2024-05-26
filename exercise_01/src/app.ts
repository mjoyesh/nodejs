import express from "express"
const app = express()
const bodyParser = require("body-parser")

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const arithmeticCalRoute = require("./routes/arithmeticRoutes")
app.use("/calculate", arithmeticCalRoute)

module.exports = app
