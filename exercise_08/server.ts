// @ts-nocheck
const app = require("./src/app")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const port = 8000

dotenv.config({ path: "./config.env" })
const database = process.env.DATABASE || ""
const database_password = process.env.DATABASE_PASSWORD || ""
const DB = database.replace("<PASSWORD>", database_password)
mongoose.connect(DB).then((con: any) => {
  // console.log(con.connections)
  console.log("DB connection successful!")
})

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`)
})
