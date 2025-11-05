import express from "express";

import { upload } from "../middleware/multer";
import container from "../inversify/inversify.config";
import { TYPES } from "../inversify/types";
import { UserController } from "../controller/implementation/user-controller";
import { catchAsync } from "@Pick2Me/shared";

const userController = container.get<UserController>(TYPES.UserController);

const userRouter = express.Router();

userRouter.post("/uploadChatFile", upload.fields([{ name: "file", maxCount: 1 }]), catchAsync(userController.uploadChatFile));
userRouter.get("/get-my-profile", catchAsync(userController.fetchUserProfile)); 

export {userRouter}