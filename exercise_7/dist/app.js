"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const userRoutes = require("./routes/userRoutes");
const generatePDFRoutes = require("./routes/generatePDFRoutes");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", userRoutes);
app.use("/generate-pdf", generatePDFRoutes);
module.exports = app;
//# sourceMappingURL=app.js.map