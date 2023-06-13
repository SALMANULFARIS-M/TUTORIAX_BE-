"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin_controller");
const router = (0, express_1.Router)();
router.post('/login', admin_controller_1.verifyLogin);
router.post('/addcourse', admin_controller_1.addCourse);
exports.default = router;
