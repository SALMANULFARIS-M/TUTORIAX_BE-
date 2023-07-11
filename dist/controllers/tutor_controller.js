"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImage = exports.updateTeacher = exports.getTeacher = exports.getAllChats = exports.verifyLogin = exports.insertTeacher = exports.checkTeacher = void 0;
const teacher_model_1 = __importDefault(require("../models/teacher_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const chat_connection_1 = __importDefault(require("../models/chat_connection"));
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
//check the teacher already exist
const checkTeacher = async (req, res, next) => {
    try {
        const mobile = parseInt(req.body.mobile);
        const data = await teacher_model_1.default.findOne({ mobile: mobile });
        if (data) {
            if (data.access) {
                if (data.approval) {
                    res
                        .status(201)
                        .send({ message: "Tutor Already Registered", status: false, number: req.body.mobile });
                }
                else {
                    res
                        .status(201)
                        .send({ message: "Your account is not approved", status: false, number: req.body.mobile });
                }
            }
            else {
                res.status(201).json({ message: "You are blocked by admin", status: false });
            }
        }
        else {
            // return success and give response true to send otp
            res.status(200).json({ number: req.body.mobile, status: true });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.checkTeacher = checkTeacher;
//Insert a new Teacher  --signup page
const insertTeacher = async (req, res, next) => {
    try {
        const mobile = parseInt(req.body.mobile);
        const data = await teacher_model_1.default.findOne({ mobile: mobile });
        if (data) {
            res
                .status(401)
                .send({ message: "E-mail Already Registered", status: false });
        }
        else {
            const psw = await securePassword(req.body.password);
            const teacher = new teacher_model_1.default({
                fullName: req.body.fullName,
                email: req.body.email,
                mobile: mobile,
                password: psw,
                certificate: req.body.certificate
            });
            await teacher.save();
            //jwt token create
            const token = await jsonwebtoken_1.default.sign({ teacher_id: teacher._id, type: "tutor" }, process.env.SECRET_KEY, {
                expiresIn: "2d",
            });
            teacher.token = token;
            if (teacher.token) {
                res.cookie("tutorjwt", token, {
                    httpOnly: true,
                    maxAge: 48 * 60 * 60 * 1000,
                });
                // return success and give response the jwt token
                res.status(200).json({ token: teacher.token, status: true });
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
        next(error);
    }
};
exports.insertTeacher = insertTeacher;
const verifyLogin = async (req, res, next) => {
    try {
        const mobile = req.body.mobile;
        const password = req.body.password;
        const teacherData = await teacher_model_1.default.findOne({ mobile: mobile });
        if (teacherData) {
            if (teacherData.approval) {
                if (teacherData?.access) {
                    const passwordCheck = await bcrypt_1.default.compare(password, teacherData.password); // comparing database bcrypt with teacher-typed password
                    if (passwordCheck) {
                        const token = await jsonwebtoken_1.default.sign({ teacher_id: teacherData._id, type: "teacher" }, process.env.SECRET_KEY, {
                            expiresIn: "2d",
                        });
                        res.cookie("teacherjwt", token, {
                            httpOnly: true,
                            maxAge: 48 * 60 * 60 * 1000,
                        });
                        teacherData.token = token;
                        res.status(200).json({ token: teacherData.token, status: true });
                    }
                    else {
                        res.status(201).send({ message: "Password is incorrect!" });
                    }
                }
                else {
                    res.status(201).json({ message: "You are blocked by admin", status: false });
                }
            }
            else {
                res.status(201).json({ message: "Your Account is not approved", status: false });
            }
        }
        else {
            res.status(400).send({
                message: "E-mail is not registered! Please signup to continue..",
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.verifyLogin = verifyLogin;
const getAllChats = async (req, res, next) => {
    try {
        const token = req.params.id;
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const id = decodedToken.teacher_id;
        const connections = await chat_connection_1.default.find({ "connection.teacher": id }).sort({ updatedAt: -1 }).populate({
            path: "connection.student",
            model: "Student",
        }).populate('last_message');
        res.status(200).json({ connections: connections, status: true, id: id });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllChats = getAllChats;
const getTeacher = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            const id = decodedToken.teacher_id;
            teacher_model_1.default.findById(id).then((data) => {
                res.status(200).json({ status: true, data });
            })
                .catch((error) => {
                next(error);
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getTeacher = getTeacher;
const updateTeacher = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            const id = decodedToken.teacher_id;
            teacher_model_1.default.findByIdAndUpdate(id, { fullName: req.body.fullName, email: req.body.email }).then((data) => {
                res.status(200).json({ status: true });
            })
                .catch((error) => {
                next(error);
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateTeacher = updateTeacher;
const updateImage = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            const id = decodedToken.teacher_id;
            teacher_model_1.default.findByIdAndUpdate(id, { image: req.body.image }).then((data) => {
                res.status(200).json({ status: true, image: data?.image });
            })
                .catch((error) => {
                next(error);
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateImage = updateImage;
