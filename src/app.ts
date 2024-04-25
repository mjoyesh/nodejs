import express from "express"
const app = express()

app.use(express.json())

const arithmeticCalRoute = require("./routes/arithmeticRoutes")
app.use("/calculate", arithmeticCalRoute)

const fileReadWriteRoute = require("./routes/readWriteFileRoutes")
app.use("/file", fileReadWriteRoute)

module.exports = app