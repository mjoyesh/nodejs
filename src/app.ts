import express from "express"
const app = express()
const bodyParser = require("body-parser")

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const arithmeticCalRoute = require("./routes/arithmeticRoutes")
app.use("/calculate", arithmeticCalRoute)

const fileReadWriteRoute = require("./routes/readWriteFileRoutes")
app.use("/file", fileReadWriteRoute)

const JSONtoExcelRoute = require("./routes/readJSONToExcelRoutes")
app.use("/file", JSONtoExcelRoute)

const migrationRoute = require("./routes/migrationRoutes")
app.use("/file", migrationRoute)

// const uploadFileRoute = require("./routes/uploadFileRoutes")
// app.use("/file", uploadFileRoute)

const authRoutes = require('./routes/authRoutes')
app.use("/auth", authRoutes)

const fileRoutes = require('./routes/fileRoutes')
app.use("/file", fileRoutes)

const uploadLogRoutes = require('./routes/uploadLogRoutes')
app.use("/uploadLog", uploadLogRoutes)

module.exports = app
