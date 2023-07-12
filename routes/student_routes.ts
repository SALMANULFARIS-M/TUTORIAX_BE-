import { Router } from "express";
import {
    checkStudent, insertStudent, verifyLogin, savePassword,googleLogin,
    saveOrder, checkPurchased,getAllTutors,chatConnection,getAllChats,
    getMessages,createMessage,applyCoupon,reportVideo,chatSeen,chatView,
    getStudent,updateStudent,updateImage
} from "../controllers/student_controller";
import { isLoggin } from "../middleware/std _mw";

const router = Router();

router.post('/checkstudent', checkStudent);
router.post('/register', insertStudent);
router.post('/login', verifyLogin);
router.post('/googlelog', googleLogin);
router.post('/savepassword', savePassword);
router.post('/payment/:id',isLoggin, saveOrder);
router.post('/checkcourse',isLoggin, checkPurchased)
router.get('/gettutors',getAllTutors);
router.get('/getallchats/:id',isLoggin,getAllChats);
router.post('/connection',chatConnection);
router.post('/getallmessages',getMessages);
router.post('/sendmessage',createMessage)
router.post('/applycoupon',isLoggin,applyCoupon);
router.post('/reportvideo',isLoggin,reportVideo);
router.post('/chatseen',chatSeen);
router.patch('/chatview/:id',chatView);
router.get('/getstudent',isLoggin,getStudent);
router.patch('/editstudent',isLoggin,updateStudent);
router.patch('/editimage',isLoggin,updateImage);


export default router;