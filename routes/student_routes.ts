import { Router } from "express";
import { checkStudent,insertStudent,verifyLogin,savePassword } from "../controllers/student_controller";

const router = Router();

router.post('/checkstudent', checkStudent);
router.post('/register', insertStudent);
router.post('/login',verifyLogin );
router.post('/savepassword',savePassword)

export default router;