import express from 'express';
import container from '../config/inversify.config';
import { AdminController } from '../controller/admin-controller';
import { TYPES } from '../types/container-type';
import { catchAsync } from '@Pick2Me/shared';

const adminUserController = container.get<AdminController>(TYPES.AdminController);

const adminRoute = express.Router();

adminRoute.get('/getActiveUserData', catchAsync(adminUserController.getUsersList));
adminRoute.get('/blockedUserData', adminUserController.getUsersList);
adminRoute.get('/userData', adminUserController.getUserData);
adminRoute.patch('/updateUserStatus', adminUserController.updateUserStatus);
