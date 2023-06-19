import { Router } from "express";
import {
    checkStudent, insertStudent, verifyLogin, savePassword,
    saveOrder, checkPurchased
} from "../controllers/student_controller";

const router = Router();

router.post('/checkstudent', checkStudent);
router.post('/register', insertStudent);
router.post('/login', verifyLogin);
router.post('/savepassword', savePassword)
router.post('/payment/:id', saveOrder)
router.post('/checkcourse', checkPurchased)
export default router;