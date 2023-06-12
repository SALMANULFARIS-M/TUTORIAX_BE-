"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.verifyLogin = void 0;
const admin_model_1 = __importDefault(require("../models/admin_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Password bcryption
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        throw new Error("Something went wrong");
    }
};
const verifyLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await admin_model_1.default.findOne({ email: email });
        if (adminData) {
            const passwordCheck = await bcrypt_1.default.compare(password, adminData.password); // comparing database bcrypt with Student-typed password
            if (passwordCheck) {
                const token = await jsonwebtoken_1.default.sign({ student_id: adminData._id, type: "admin" }, process.env.SECRET_KEY, {
                    expiresIn: "2d",
                });
                res.cookie("adminjwt", token, {
                    httpOnly: true,
                    maxAge: 48 * 60 * 60 * 1000,
                });
                adminData.token = token;
                res.status(200).json({ token: adminData.token, status: true });
            }
            else {
                res.status(400).send({ message: "Password is incorrect!" });
            }
        }
        else {
            res.status(400).send({
                message: "E-mail is not registered! You are not an admin..",
            });
        }
    }
    catch (error) {
        res.status(400).json({ message: "Something went wrong", status: false });
    }
};
exports.verifyLogin = verifyLogin;
const Login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const psw = await securePassword(password);
        const student = new admin_model_1.default({
            email: email,
            password: psw,
        });
        await student.save();
        res.status(200).json({ status: true });
    }
    catch (error) {
    }
};
exports.Login = Login;
