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
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../services/emailService");
dotenv.config({ path: "./config.env" });
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const newUser = yield user.save();
        yield sendWelcomeEmail(req.body.email);
        res.status(200).json({
            status: "success",
            message: "User created successfully",
            data: newUser,
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found!",
            });
        }
        const validPassword = yield bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid Password!",
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: 24 * 60 * 60 * 1000, //expires in 24 hours
        });
        res.status(200).json({
            status: "success",
            message: "Logged in successfully!",
            token,
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(200).json({
                status: "fail",
                message: "User not found!",
            });
        }
        res.status(200).json({
            data: user,
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.userId);
        if (!user) {
            return res.status(200).json({
                message: "User not found!",
            });
        }
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.password = yield bcrypt.hash(req.body.password, 10);
        }
        const updatedUser = yield user.save();
        res.status(200).json({
            status: "success",
            message: "User updated successfully!",
            data: updatedUser,
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};
//# sourceMappingURL=userController.js.map