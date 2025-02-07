import express from "express";
import { buyMembership,getMembership,cancelMembership,checkMembership } from "../controller/membership.js";
import verify from "../middleware/verify.js";
const router = express.Router();

router.post("/buy",verify, buyMembership);
router.get("/getmembership",verify, getMembership);
router.post("/cancel",verify, cancelMembership);
router.get("/valid/:userId", verify,checkMembership);

export default router;
