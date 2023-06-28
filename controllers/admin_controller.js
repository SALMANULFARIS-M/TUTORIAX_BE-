"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.addCoupon = exports.getCoupons = exports.approveTutor = exports.blockTutor = exports.getTutor = exports.getAllTutors = exports.blockStudent = exports.getAllStudents = exports.editCourse = exports.getCourse = exports.deleteCourse = exports.getAllCourse = exports.addCourse = exports.verifyLogin = void 0;
const admin_model_1 = __importDefault(require("../models/admin_model"));
const student_model_1 = __importDefault(require("../models/student_model"));
const teacher_model_1 = __importDefault(require("../models/teacher_model"));
const course_model_1 = __importDefault(require("../models/course_model"));
const coupon_model_1 = __importDefault(require("../models/coupon_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
                res.status(401).send({ message: "Password is incorrect!", status: true });
            }
        }
        else {
            res.status(401).send({
                message: "E-mail is not registered! You are not an admin..",
                status: true
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
        course_model_1.default.find({ report: { $size: { $gt: 1 } } }).then((result) => {
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
        course_model_1.default.findOne({
            _id: id,
            $expr: { $lt: [{ $size: "$report" }, 2] }
        }).then((result) => {
            if (result) {
                res.status(200).json({ course: result, status: true });
            }
            else {
                res.status(404).json({ message: 'Course not found', status: false });
            }
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
            next(error);
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
        const flag = req.body.access;
        if (flag) {
            student_model_1.default.findByIdAndUpdate(req.params.id, {
                access: false
            }).then((result) => {
                res.status(200).json({ Message: "Blocked the student", status: true });
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            student_model_1.default.findByIdAndUpdate(req.params.id, {
                access: true
            }).then((result) => {
                res.status(200).json({ Message: "Unblocked the student", status: true });
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
const getAllTutors = async (req, res, next) => {
    try {
        teacher_model_1.default.find().then((result) => {
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
const getTutor = async (req, res, next) => {
    try {
        const id = req.params.id;
        teacher_model_1.default.findById(id).then((result) => {
            res.status(200).json({ tutor: result, status: true });
        }).catch((error) => {
            console.log(error, "dfds");
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTutor = getTutor;
const blockTutor = async (req, res, next) => {
    try {
        const flag = req.body.access;
        if (flag) {
            teacher_model_1.default.findByIdAndUpdate(req.params.id, {
                access: false
            }).then((result) => {
                res.status(200).json({ Message: "Blocked the tutor", status: true });
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            teacher_model_1.default.findByIdAndUpdate(req.params.id, {
                access: true
            }).then((result) => {
                res.status(200).json({ Message: "Unblocked the tutor", status: true });
            }).catch((error) => {
                console.log(error);
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.blockTutor = blockTutor;
const approveTutor = async (req, res, next) => {
    try {
        teacher_model_1.default.findByIdAndUpdate(req.params.id, {
            approval: true
        }).then((result) => {
            res.status(200).json({ Message: "Tutor has approved for our website", status: true });
        }).catch((error) => {
            console.log(error);
        });
    }
    catch (error) {
        next(error);
    }
};
exports.approveTutor = approveTutor;
const getCoupons = async (req, res, next) => {
    try {
        await coupon_model_1.default.find({}).then((result) => {
            res.status(200).json({ coupons: result, status: true });
        }).catch((error) => {
            next(error);
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCoupons = getCoupons;
const addCoupon = async (req, res, next) => {
    try {
        const name = req.body.code;
        const existData = await coupon_model_1.default.findOne({
            code: { $regex: name, $options: "i" },
        });
        if (!existData) {
            const percentage = req.body.discountPercentage;
            const max_dis = req.body.maxDiscount;
            const Amount = req.body.minAmount;
            const date = new Date(req.body.expDate);
            const coupon = new coupon_model_1.default({
                code: name,
                discountPercentage: percentage,
                maxDiscount: max_dis,
                minAmount: Amount,
                expDate: date,
            });
            await coupon.save().then((result) => {
                res.status(200).json({ coupons: result, status: true });
            }).catch((error) => {
                next(error);
            });
            ;
        }
        else {
            res.status(200).json({ message: "coupon Already Exist", status: false });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.addCoupon = addCoupon;
const deleteCoupon = async (req, res, next) => {
    try {
        await coupon_model_1.default.findByIdAndDelete({ _id: req.params.id }).then((result) => {
            res.status(200).json({ status: true });
        }).catch((error) => {
            next(error);
        });
        ;
        ;
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCoupon = deleteCoupon;
