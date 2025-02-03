import express from "express";
import { buyMembership,getMembership,cancelMembership,checkMembership } from "../controller/membership.js";

const router = express.Router();

router.post("/buy", buyMembership);
router.get("/:userId", getMembership);
router.post("/cancel", cancelMembership);
router.get("/valid/:userId", checkMembership);

export default router;
