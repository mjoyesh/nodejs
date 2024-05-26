const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" })

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  // logger: true,
  // debug: true,
})

transporter.verify(function (error: any) {
  if (error) {
    console.log("Error connecting to email server:", error)
  } else {
    console.log("Email server is ready to send messages")
  }
})

const sendWelcomeEmail = async (userEmail: string) => {
  const mailOptions = {
    from: `"Node Exercise" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Welcome to Our Service!",
    text: "Thank you for signing up for our service. We are glad to have you on board!",
    html: "<strong>Thank you for signing up for our service. We are glad to have you on board!</strong>",
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error: any) {
    console.error("Error sending welcome email", error)
  }
}

const sendPromotionalEmail = async (userEmail: string, products: any) => {
  const productDetails = products
    .map((product: any) => `<li>${product.name} - Rs. ${product.price}</li>`)
    .join("")

  const mailOptions = {
    from: `"Node Exercise" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Check out these great products!",
    text: "We have some amazing products for you!",
    html: `<strong>We have some amazing products for you!</strong><ul>${productDetails}</ul>`,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Promotional email sent successfully")
  } catch (error: any) {
    console.error("Error sending promotional email", error)
  }
}

module.exports = { sendWelcomeEmail, sendPromotionalEmail }
