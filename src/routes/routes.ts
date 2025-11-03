import { Router } from "express";
import { authRoute } from "./authRouter";
import { userRoute } from "./userRouter";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

// authRoute
router.use("/", authRoute);

// userRoute
router.use("/", checkAuth, userRoute);

// profileRoute
router.use("/", checkAuth, profileRoute);

// cloudinaryRoute
router.use("/", checkAuth, cloudinaryRoute)

export default router;