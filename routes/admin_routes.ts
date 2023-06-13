import { Router } from "express";
import {verifyLogin,addCourse } from "../controllers/admin_controller";
import path from 'path';

const router = Router();
router.post('/login',verifyLogin);
router.post('/login/addcourse',addCourse);

export default router;