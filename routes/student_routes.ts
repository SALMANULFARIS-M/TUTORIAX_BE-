import { Router } from "express";
import {
    checkStudent, insertStudent, verifyLogin, savePassword,
    saveOrder, checkPurchased,getAllTutors,chatConnection,getAllChats,
    getMessages,createMessage,applyCoupon,reportVideo,chatSeen,chatView,
    getStudent,updateStudent,updateImage
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
router.post('/getallmessages',getMessages);
router.post('/sendmessage',createMessage)
router.post('/applycoupon',applyCoupon);
router.post('/reportvideo',reportVideo);
router.post('/chatseen',chatSeen);
router.patch('/chatview/:id',chatView);
router.get('/getstudent',getStudent);
router.patch('/editstudent',updateStudent);
router.patch('/editimage',updateImage);


export default router;