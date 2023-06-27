"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.getMessages = exports.getAllChats = exports.chatConnection = exports.getAllTutors = exports.checkPurchased = exports.saveOrder = exports.savePassword = exports.verifyLogin = exports.insertStudent = exports.checkStudent = void 0;
const student_model_1 = __importDefault(require("../models/student_model"));
const chat_connection_1 = __importDefault(require("../models/chat_connection"));
const chat_content_1 = __importDefault(require("../models/chat_content"));
const teacher_model_1 = __importDefault(require("../models/teacher_model"));
const order_model_1 = __importDefault(require("../models/order_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
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
            if (data.access) {
                res
                    .status(201)
                    .send({ message: "Student Already Registered", status: false, number: req.body.mobile });
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
            const token = jsonwebtoken_1.default.sign({ student_id: student._id, type: "student" }, process.env.SECRET_KEY, {
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
        next(error);
    }
};
exports.insertStudent = insertStudent;
const verifyLogin = async (req, res, next) => {
    try {
        const mobile = req.body.mobile;
        const password = req.body.password;
        const studentData = await student_model_1.default.findOne({ mobile: mobile });
        if (studentData?.access) {
            if (studentData) {
                const passwordCheck = await bcrypt_1.default.compare(password, studentData.password); // comparing database bcrypt with Student-typed password
                if (passwordCheck) {
                    const token = jsonwebtoken_1.default.sign({ student_id: studentData._id, type: "student" }, process.env.SECRET_KEY, {
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
        else {
            res.status(201).json({ message: "You are blocked by admin", status: false });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.verifyLogin = verifyLogin;
const savePassword = async (req, res, next) => {
    try {
        const mobile = parseInt(req.body.mobile);
        const psw = await securePassword(req.body.password);
        await student_model_1.default.findOneAndUpdate({ mobile: mobile }, { password: psw }).then((result) => {
            res.status(200).json({ message: "success", status: true });
        });
    }
    catch (error) {
        next(error);
    }
};
exports.savePassword = savePassword;
const saveOrder = async (req, res, next) => {
    try {
        const token = req.params.id;
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.student_id;
        const order = new order_model_1.default({
            payment_id: req.body.stripeToken,
            course_id: req.body.courseId,
            student_id: userId,
            amount: req.body.amount
        });
        await order.save().then((response) => {
            student_model_1.default.findByIdAndUpdate(response.student_id, { $push: { purchased_course: response.course_id } }, { new: true }).then((updatedStudent) => {
                if (updatedStudent) {
                    res.status(200).json({ message: "success", id: response.course_id, status: true });
                }
            })
                .catch((error) => {
                console.error("Error updating purchased course:", error);
            });
        });
    }
    catch (error) {
        next(error);
    }
};
exports.saveOrder = saveOrder;
const checkPurchased = async (req, res, next) => {
    try {
        const token = req.body.token;
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const studentId = decodedToken.student_id;
        student_model_1.default.findOne({ _id: studentId, purchased_course: req.body.courseId })
            .then((foundStudent) => {
            if (foundStudent) {
                res.status(200).json({ message: "Course exists in purchased courses", status: true });
            }
            else {
                res.status(200).json({ message: "Course does not exist in purchased courses", status: false });
            }
        })
            .catch((error) => {
            console.error("Error searching for student:", error);
        });
    }
    catch (error) {
        next(error);
    }
};
exports.checkPurchased = checkPurchased;
const getAllTutors = async (req, res, next) => {
    try {
        teacher_model_1.default.find({ approval: true, access: true }).then((result) => {
            const data = result;
            res.status(200).json({ data, status: true });
        }).catch((error) => {
            console.log(error);
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTutors = getAllTutors;
const chatConnection = async (req, res, next) => {
    try {
        const token = req.body.student;
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const studentId = decodedToken.student_id;
        const connection = { student: new mongodb_1.ObjectId(studentId), teacher: new mongodb_1.ObjectId(req.body.tutor) };
        const existingConnection = await chat_connection_1.default.findOne({
            "connection.student": connection.student,
            "connection.teacher": connection.teacher
        });
        if (existingConnection) {
            res.status(200).json({ existingConnection, status: true });
        }
        else {
            const newConnection = new chat_connection_1.default({ connection });
            await newConnection.save();
            res.status(200).json({ newConnection, status: true });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.chatConnection = chatConnection;
const getAllChats = async (req, res, next) => {
    try {
        const token = req.params.id;
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const id = decodedToken.student_id;
        const connections = await chat_connection_1.default.find({ "connection.student": id }).sort({ updatedAt: -1 }).populate({
            path: "connection.teacher",
            model: "Teacher",
        }).populate('last_message');
        res.status(200).json({ connections: connections, status: true, id: id });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllChats = getAllChats;
const getMessages = async (req, res, next) => {
    try {
        const id = req.params.id;
        const room = await chat_connection_1.default.findById(id).populate({
            path: 'connection.student',
            model: 'Student'
        }).populate({
            path: 'connection.teacher',
            model: 'Teacher'
        });
        const messages = await chat_content_1.default.find({ connection_id: id }).populate('connection_id').populate({
            path: 'connection_id',
            populate: {
                path: 'connection.student',
                model: 'Student'
            }
        })
            .populate({
            path: 'connection_id',
            populate: {
                path: 'connection.teacher',
                model: 'Teacher'
            }
        });
        res.status(200).json({ messages: messages, status: true, room: room });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessages = getMessages;
const createMessage = async (req, res, next) => {
    try {
        const newChatContent = new chat_content_1.default({
            connection_id: req.body.connection,
            from: req.body.sender,
            to: req.body.receiver,
            text: req.body.text,
        });
        // Save the document to the database
        newChatContent.save()
            .then((savedChatContent) => {
            chat_connection_1.default.findByIdAndUpdate(savedChatContent.connection_id, { last_message: savedChatContent._id }).then((result) => {
                if (result) {
                    chat_content_1.default.findById({ _id: savedChatContent._id }).populate('connection_id').populate({
                        path: 'connection_id',
                        populate: {
                            path: 'connection.student',
                            model: 'Student'
                        }
                    })
                        .populate({
                        path: 'connection_id',
                        populate: {
                            path: 'connection.teacher',
                            model: 'Teacher'
                        }
                    }).then((result) => {
                        res.status(200).json({ data: result, status: true, id: req.body.connection });
                    });
                }
            }).catch((error) => {
                console.error('Error updating last message:', error);
            });
        })
            .catch((error) => {
            console.error('Error saving Chat_Content document:', error);
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createMessage = createMessage;
