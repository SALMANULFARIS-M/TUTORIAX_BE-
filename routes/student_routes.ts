import { Router } from "express";
import {
    checkStudent, insertStudent, verifyLogin, savePassword,
    saveOrder, checkPurchased,getAllTutors
} from "../controllers/student_controller";

const router = Router();

router.post('/checkstudent', checkStudent);
router.post('/register', insertStudent);
router.post('/login', verifyLogin);
router.post('/savepassword', savePassword)
router.post('/payment/:id', saveOrder)
router.post('/checkcourse', checkPurchased)
router.get('/gettutors',getAllTutors)
router.post('/connection')

export default router;