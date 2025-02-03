import express from "express";
import { postSignup, postLogin } from "../controller/user.js";

const router = express.Router();

router.post("/register", postSignup);
router.post("/login", postLogin);

export default router;
