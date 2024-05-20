const { sendPromotionalEmail } = require("../services/emailService")

const sendPromotionalEmailController = async (req: any, res: any) => {
  const { email, products } = req.body

  try {
    await sendPromotionalEmail(email, products)
    res.status(200).json({
      status: "success",
      message: "Promotional email sent successfully!",
    })
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Error sending promotional email",
      error: error.message,
    })
  }
}

module.exports = { sendPromotionalEmailController }
