"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const generatePDFRoutes = require("./routes/generatePDFRoutes");
app.use(express_1.default.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", userRoutes);
app.use("/generate-pdf", generatePDFRoutes);
module.exports = app;
//# sourceMappingURL=app.js.map