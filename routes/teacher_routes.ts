import { Router } from "express";
import { checkTeacher,insertTeacher,verifyLogin } from "../controllers/tutor_controller";

const router = Router();

router.post('/checktutor',checkTeacher);
router.post('/register',insertTeacher);
router.post('/login',verifyLogin);

export default router;