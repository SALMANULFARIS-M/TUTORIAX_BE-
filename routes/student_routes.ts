import { Router } from "express";
import { checkStudent,insertStudent,verifyLogin } from "../controllers/student_controller";
import path from 'path';

const router = Router();

router.post('/checkuser', checkStudent);
router.post('/register', insertStudent);
router.post('/login',verifyLogin );

export default router;