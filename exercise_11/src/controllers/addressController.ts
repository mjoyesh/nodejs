const Address = require("../models/addressSchema")

const addAddress = async (req: any, res: any) => {
  try {
    const {
      userId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    } = req.body
    const address = new Address({
      userId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    })

    await address.save()
    res.status(201).send("Address added successfully")
  } catch (error: any) {
    res.status(500).send(error.message)
  }
}

module.exports = { addAddress }
