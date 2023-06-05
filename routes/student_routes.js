"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controllers/student_controller");
const router = (0, express_1.Router)();
router.post('/checkuser', student_controller_1.checkStudent);
router.post('/register', student_controller_1.insertStudent);
router.post('/login', student_controller_1.verifyLogin);
exports.default = router;
