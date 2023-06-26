import { Router } from "express";
import {
    checkStudent, insertStudent, verifyLogin, savePassword,
    saveOrder, checkPurchased,getAllTutors,chatConnection,getAllChats,
    getMessages,createMessage,
} from "../controllers/student_controller";

const router = Router();

router.post('/checkstudent', checkStudent);
router.post('/register', insertStudent);
router.post('/login', verifyLogin);
router.post('/savepassword', savePassword);
router.post('/payment/:id', saveOrder);
router.post('/checkcourse', checkPurchased)
router.get('/gettutors',getAllTutors);
router.get('/getallchats/:id',getAllChats);
router.post('/connection',chatConnection);
router.get('/getallmessages/:id',getMessages);
router.post('/sendmessage',createMessage)

export default router;