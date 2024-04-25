const express = require("express")
const app = express()

app.use(express.json())

const arithmeticCalRouter = require("./routes/arithmeticRoutes")
app.use("/calculate", arithmeticCalRouter)

module.exports = app