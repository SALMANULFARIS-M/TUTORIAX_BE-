"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tutor_controller_1 = require("../controllers/tutor_controller");
const router = (0, express_1.Router)();
router.post('/checktutor', tutor_controller_1.checkTeacher);
router.post('/register', tutor_controller_1.insertTeacher);
router.post('/login', tutor_controller_1.verifyLogin);
exports.default = router;
