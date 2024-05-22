"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        res.status(403).send({
            auth: false,
            message: "Please provide a token!"
        });
    }
    const tokenWithoutBearer = token.split(" ")[1];
    jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: "Failed to authenticate token"
            });
        }
        req.userId = decoded.id;
        next();
    });
};
module.exports = verifyToken;
//# sourceMappingURL=authMiddleware.js.map