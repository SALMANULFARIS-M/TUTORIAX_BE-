"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_model_1 = __importDefault(require("../models/student_model"));
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
//Insert a new Student  --signup page
const InsertStudent = async (req, res, next) => {
    try {
        const data = await student_model_1.default.findOne({ email: req.body.email });
        if (data) {
            res
                .status(400)
                .send({ message: "E-mail Already Registered", status: false });
        }
        else {
            const psw = await securePassword(req.body.password);
            const student = new student_model_1.default({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
                password: psw,
            });
            await student.save();
            //jwt token create
            const token = await jsonwebtoken_1.default.sign({ student_id: student._id, type: "student" }, process.env.SECRET_KEY, {
                expiresIn: "2d",
            });
            student.token = token;
            if (student.token) {
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: 48 * 60 * 60 * 1000,
                });
                // return success
                res.status(200).json({ token: student.token, status: true });
            }
            else {
                res.status(400).send({
                    message: "Registration failed, please try again!",
                    status: false,
                });
            }
        }
    }
    catch (error) {
        res.status(400).json({ message: "Something went wrong", status: true });
    }
};
