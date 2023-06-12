import { Router } from "express";
import {verifyLogin } from "../controllers/admin_controller";
import path from 'path';

const router = Router();
router.post('/login',verifyLogin);

export default router;