import { Router } from "express";
import { checkTeacher, } from "../controllers/tutor_controller";

const router = Router();

router.post('/checktutor',checkTeacher)
router.post('/register')

export default router;