import express from "express";
import { buyMembership,getMembership,cancelMembership,checkMembership,createOrder  } from "../controller/membership.js";
import verify from "../middleware/verify.js";
const router = express.Router();

router.post("/api/buy",verify, buyMembership);
router.get("/api/getmembership", getMembership);
router.post("/api/cancel",verify, cancelMembership);
router.get("/api/valid", verify,checkMembership);
router.post("/api/order", verify,createOrder);

export default router;
