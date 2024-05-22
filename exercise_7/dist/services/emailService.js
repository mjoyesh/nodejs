"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
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
});
transporter.verify(function (error) {
    if (error) {
        console.log("Error connecting to email server:", error);
    }
    else {
        console.log("Email server is ready to send messages");
    }
});
const sendWelcomeEmail = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"Node Exercise" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Welcome to Our Service!",
        text: "Thank you for signing up for our service. We are glad to have you on board!",
        html: "<strong>Thank you for signing up for our service. We are glad to have you on board!</strong>",
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error sending welcome email", error);
    }
});
const sendPromotionalEmail = (userEmail, products) => __awaiter(void 0, void 0, void 0, function* () {
    const productDetails = products
        .map((product) => `<li>${product.name} - Rs. ${product.price}</li>`)
        .join("");
    const mailOptions = {
        from: `"Node Exercise" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Check out these great products!",
        text: "We have some amazing products for you!",
        html: `<strong>We have some amazing products for you!</strong><ul>${productDetails}</ul>`,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log("Promotional email sent successfully");
    }
    catch (error) {
        console.error("Error sending promotional email", error);
    }
});
module.exports = { sendWelcomeEmail, sendPromotionalEmail };
//# sourceMappingURL=emailService.js.map