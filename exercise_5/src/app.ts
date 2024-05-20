import express from "express"
const app = express()
const bodyParser = require("body-parser")
const categoryRoutes = require("./routes/categoryRoutes")
const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")
const cartRoutes = require("./routes/cartRoutes")

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/categories", categoryRoutes)
app.use("/products", productRoutes)
app.use("/auth", userRoutes)
app.use("/cart", cartRoutes)
app.use("/order", cartRoutes)

module.exports = app
