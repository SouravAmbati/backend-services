import express from "express";
import { AdminLogin, Loginuser, Registeruser } from "../controllers/authControllers.js";

const router = express.Router();


router.post('/register',Registeruser)
router.post('/login',Loginuser)
router.post('/admin',AdminLogin)

export default router;
