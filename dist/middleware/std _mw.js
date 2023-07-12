"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isLoggin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "auth failed",
                Status: false,
            });
        }
        else {
            jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        message: "auth failed",
                        Status: false,
                    });
                }
                else {
                    const { student_id } = decoded;
                    req.body.userId = student_id;
                    next();
                }
            });
        }
    }
    catch (error) {
        return res.status(401).send({
            message: "auth failed",
            success: false,
        });
    }
};
exports.isLoggin = isLoggin;
