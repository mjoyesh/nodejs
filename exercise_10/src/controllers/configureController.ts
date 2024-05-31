const Product = require("../models/productSchema")

const configure = async (req: any, res: any) => {
  const { category, name, price } = req.body

  if (!category || !name || !price) {
    alert("Please enter all the details!")
  }

  const newProduct = new Product({ category, name, price })

  newProduct
    .save()
    .then(() => {
      res.json({
        status: "success",
        data: newProduct
      })
      res.redirect("/homepage")
    })
    .catch((err: any) => console.log(err))
}

module.exports = { configure }
