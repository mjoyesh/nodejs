import express from "express"
const app = express()
const bodyParser = require("body-parser")
const categoryRoutes = require("./routes/categoryRoutes")
const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const promotionalEmailRoutes = require("./routes/promotionalEmailRoutes")

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/categories", categoryRoutes)
app.use("/products", productRoutes)
app.use("/auth", userRoutes)
app.use("/cart", cartRoutes)
app.use("/order", orderRoutes)
app.use("/send-promotional-email", promotionalEmailRoutes)

module.exports = app
