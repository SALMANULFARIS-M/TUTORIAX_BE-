import { Router } from "express";
import {verifyLogin,addCourse,getAllCourse,deleteCourse } from "../controllers/admin_controller";
import path from 'path';

const router = Router();
router.post('/login',verifyLogin);
router.post('/addcourse',addCourse);
router.get('/getallcourses',getAllCourse);
router.delete('/deletecourse/:id',deleteCourse)

export default router;