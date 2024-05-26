import express from "express"
const app = express()
const bodyParser = require("body-parser")

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const migrationRoute = require("./routes/migrationRoutes")
app.use("/file", migrationRoute)

module.exports = app
