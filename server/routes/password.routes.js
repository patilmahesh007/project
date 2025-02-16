import express from "express";
import { forgotPassword, resetPassword } from "../controller/forgot.js";

const router = express.Router();

router.post("/api/forgot", forgotPassword);
router.post("/api/reset/:token", resetPassword);


export default router;
