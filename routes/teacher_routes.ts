import { Router } from "express";
import { checkTeacher,insertTeacher,verifyLogin,getAllChats,
    getTeacher,updateTeacher,updateImage
 } from "../controllers/tutor_controller";

const router = Router();

router.post('/checktutor',checkTeacher);
router.post('/register',insertTeacher);
router.post('/login',verifyLogin);
router.get('/getallchats/:id',getAllChats);
router.get('/getteacher',getTeacher);
router.patch('/editteacher',updateTeacher);
router.patch('/editimage',updateImage);

export default router;