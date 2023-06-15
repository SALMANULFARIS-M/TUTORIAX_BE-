import { Router } from "express";
import {verifyLogin,addCourse,getAllCourse } from "../controllers/admin_controller";
import path from 'path';

const router = Router();
router.post('/login',verifyLogin);
router.post('/addcourse',addCourse);
router.get('/getallcourses',getAllCourse);
router.delete('/deletecourse/:id')

export default router;