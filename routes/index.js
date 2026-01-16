import express from "express";
import userRouter from "./user.routes.js";
import profileRouter from "./profile.routes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/profile", profileRouter);

export default router;