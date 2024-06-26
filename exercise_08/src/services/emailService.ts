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

const sendVerificationEmail = async (userEmail: string, token: string) => {
  const verificationUrl = `http://localhost:8000/auth/verify-email?token=${token}`
  const mailOptions = {
    from: `"Node Exercise" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Verify Your Email",
    html: `<p>Please verify your email by clicking on the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error: any) {
    console.error("Error sending verification email", error)
  }
}

module.exports = { sendVerificationEmail }
