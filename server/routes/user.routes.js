import express from "express";
import { postSignup, postLogin ,getUserRole,getUserProfile} from "../controller/user.js";

const router = express.Router();

router.post("/register", postSignup);
router.post("/login", postLogin);
router.get("/role", getUserRole);
router.get("/profile", getUserProfile);

export default router;
