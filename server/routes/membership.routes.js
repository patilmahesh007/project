import express from "express";
import { buyMembership,getMembership,cancelMembership,checkMembership,createOrder  } from "../controller/membership.js";
import verify from "../middleware/verify.js";
const router = express.Router();

router.post("/buy",verify, buyMembership);
router.get("/getmembership", getMembership);
router.post("/cancel",verify, cancelMembership);
router.get("/valid", verify,checkMembership);
router.post("/order", verify,createOrder);

export default router;
