import { Router } from "express";
import {
    verifyLogin, addCourse, getAllCourse, deleteCourse,
    getCourse,editCourse,getAllStudents
} from "../controllers/admin_controller";

const router = Router();
router.post('/login', verifyLogin);
router.get('/getallstudents', getAllStudents);
router.post('/addcourse', addCourse);
router.get('/getallcourses', getAllCourse);
router.delete('/deletecourse/:id', deleteCourse)
router.get('/getcourse/:id', getCourse)
router.patch('/editcourse/:id', editCourse)


export default router;  