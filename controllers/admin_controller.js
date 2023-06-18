"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockStudent = exports.getAllStudents = exports.editCourse = exports.getCourse = exports.deleteCourse = exports.getAllCourse = exports.addCourse = exports.verifyLogin = void 0;
const admin_model_1 = __importDefault(require("../models/admin_model"));
const student_model_1 = __importDefault(require("../models/student_model"));
const course_model_1 = __importDefault(require("../models/course_model"));
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
        next(error);
    }
};
exports.verifyLogin = verifyLogin;
const addCourse = async (req, res, next) => {
    try {
        const title = req.body.title;
        const data = await course_model_1.default.findOne({ title: title });
        if (data) {
            res
                .status(400)
                .send({ message: "Course Already Exist", status: false });
        }
        else {
            const date = new Date(req.body.date);
            const course = new course_model_1.default({
                title: title,
                author: req.body.author,
                date: date,
                price: req.body.price,
                image_id: req.body.thumbnail,
                video_id: req.body.video,
                description: req.body.description
            });
            await course.save().then(() => {
                res.status(200).json({ message: "Successfully added a course", status: true });
            }).catch(() => {
                res.status(400).json({ message: "Something went wrong", status: false });
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.addCourse = addCourse;
const getAllCourse = async (req, res, next) => {
    try {
        course_model_1.default.find().then((result) => {
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
exports.getAllCourse = getAllCourse;
const deleteCourse = async (req, res, next) => {
    try {
        course_model_1.default.findByIdAndDelete({ _id: req.params.id }).then((result) => {
            console.log(result);
            res.status(200).json({ thumbnailURL: result?.image_id, videoURL: result?.video_id, message: "Successfully deleted", status: true });
        }).catch((error) => {
            console.log(error);
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCourse = deleteCourse;
const getCourse = async (req, res, next) => {
    try {
        const id = req.params.id;
        course_model_1.default.findById(id).then((result) => {
            res.status(200).json({ course: result, status: true });
        }).catch((error) => {
            console.log(error, "dfds");
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourse = getCourse;
const editCourse = async (req, res, next) => {
    try {
        const date = new Date(req.body.date);
        course_model_1.default.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            author: req.body.author,
            date: date,
            price: req.body.price,
            image_id: req.body.thumbnail,
            video_id: req.body.video,
            description: req.body.description
        })
            .then((result) => {
            res.status(200).json({ message: "Successfully changed", status: true });
        })
            .catch((error) => {
            console.log(error);
        });
    }
    catch (error) {
        next(error);
    }
};
exports.editCourse = editCourse;
const getAllStudents = async (req, res, next) => {
    try {
        student_model_1.default.find().then((result) => {
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
exports.getAllStudents = getAllStudents;
const blockStudent = async (req, res, next) => {
    try {
        console.log(req.body,"kljkljkljkl");
        const flag = req.body.access;
        if (flag) {
            console.log("jhjk");
            student_model_1.default.findByIdAndUpdate(req.params.id, {
                access: false
            }).then((result) => {
                console.log(result);
                res.status(200).json({ Message: "Blocked the student", status: true });
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            console.log("jhiuoo;ojo';k;ljk");
            student_model_1.default.findByIdAndUpdate(req.params.id, {
                access: true
            }).then((result) => {
                console.log(result);
                res.status(200).json({ Message: "Unblocked the student" , status: true });
            }).catch((error) => {
                console.log(error);
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.blockStudent = blockStudent;
