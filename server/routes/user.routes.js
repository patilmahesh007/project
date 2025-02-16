import express from "express";
import { postSignup, postLogin ,getUserRole,getUserProfile} from "../controller/user.js";

const router = express.Router();

router.post("/api/register", postSignup);
router.post("/api/login", postLogin);
router.get("/api/role", getUserRole);
router.get("/api/profile", getUserProfile);

export default router;
