import express from "express"
const app = express()
const bodyParser = require("body-parser")
const userRoutes = require("./routes/userRoutes")
const generatePDFRoutes = require("./routes/generatePDFRoutes")

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/auth", userRoutes)
app.use("/generate-pdf", generatePDFRoutes)

module.exports = app
