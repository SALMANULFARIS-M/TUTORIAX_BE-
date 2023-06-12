"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePassword = exports.verifyLogin = exports.insertStudent = exports.checkStudent = void 0;
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
//check the Student already exist
const checkStudent = async (req, res, next) => {
    try {
        const mobile = parseInt(req.body.mobile);
        const data = await student_model_1.default.findOne({ mobile: mobile });
        if (data) {
            res
                .status(201)
                .send({ message: "Student Already Registered", status: false, number: req.body.mobile });
        }
        else {
            // return success and give response true to send otp
            res.status(200).json({ number: req.body.mobile, status: true });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something went wrong" });
    }
};
exports.checkStudent = checkStudent;
//Insert a new Student  --signup page
const insertStudent = async (req, res, next) => {
    try {
        const mobile = parseInt(req.body.mobile);
        const data = await student_model_1.default.findOne({ mobile: mobile });
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
                mobile: mobile,
                password: psw,
            });
            await student.save();
            //jwt token create
            const token = await jsonwebtoken_1.default.sign({ student_id: student._id, type: "student" }, process.env.SECRET_KEY, {
                expiresIn: "2d",
            });
            student.token = token;
            if (student.token) {
                res.cookie("studentjwt", token, {
                    httpOnly: true,
                    maxAge: 48 * 60 * 60 * 1000,
                });
                // return success and give response the jwt token
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
exports.insertStudent = insertStudent;
const verifyLogin = async (req, res, next) => {
    try {
        const mobile = req.body.mobile;
        const password = req.body.password;
        const studentData = await student_model_1.default.findOne({ mobile: mobile });
        if (studentData) {
            const passwordCheck = await bcrypt_1.default.compare(password, studentData.password); // comparing database bcrypt with Student-typed password
            if (passwordCheck) {
                const token = await jsonwebtoken_1.default.sign({ student_id: studentData._id, type: "student" }, process.env.SECRET_KEY, {
                    expiresIn: "2d",
                });
                res.cookie("studentjwt", token, {
                    httpOnly: true,
                    maxAge: 48 * 60 * 60 * 1000,
                });
                studentData.token = token;
                res.status(200).json({ token: studentData.token, status: true });
            }
            else {
                res.status(400).send({ message: "Password is incorrect!" });
            }
        }
        else {
            res.status(400).send({
                message: "E-mail is not registered! Please signup to continue..",
            });
        }
    }
    catch (error) {
        res.status(400).json({ message: "Something went wrong", status: false });
    }
};
exports.verifyLogin = verifyLogin;
const savePassword = async (req, res, next) => {
    try {
        console.log(req.body);
        const mobile = parseInt(req.body.mobile);
        const psw = await securePassword(req.body.password);
        await student_model_1.default.findOneAndUpdate({ mobile: mobile }, { password: psw });
        res.status(200).json({ message: "success", status: true });
    }
    catch (error) {
        res.status(400).json({ message: "Something went wrong", status: false });
    }
};
exports.savePassword = savePassword;
