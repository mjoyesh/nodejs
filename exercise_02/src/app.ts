import express from "express"
const app = express()
const bodyParser = require("body-parser")

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const fileReadWriteRoute = require("./routes/readWriteFileRoutes")
app.use("/file", fileReadWriteRoute)

const JSONtoExcelRoute = require("./routes/readJSONToExcelRoutes")
app.use("/file", JSONtoExcelRoute)

module.exports = app
