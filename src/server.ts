import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import "dotenv/config";
import { connectSQL } from './config/sql-database';
connectSQL(); 

import registrationControl from './controller/implementation/registration_controller';
import loginControl from './controller/implementation/login_controller';
// import UserControl from './controller/implementation/user_controller';
import adminControl from './controller/implementation/admin_controller';
import LoginUseCases from "./services/implementation/login_service";
// import UserService from "./services/implementation/user_service";
import RegistrationUseCases from "./services/implementation/registration_service";
import AdminUseCases from "./services/implementation/admin_service";
import { AuthService } from "./utilities/auth"
import UserRepository from "./repositories/implementation/userRepo";

const authService = new AuthService();
const userRepo = new UserRepository();
const adminUseCases = new AdminUseCases(userRepo);
const registrationUseCases = new RegistrationUseCases(userRepo);
// const userService = new UserService(userRepo);
const loginUseCases = new LoginUseCases(userRepo, authService);

const adminController = new adminControl(adminUseCases);
const registrationController = new registrationControl(authService, registrationUseCases); 
const loginController = new loginControl(loginUseCases);
// const userController = new UserControl(userService);

const packageDef = protoLoader.loadSync(path.resolve(__dirname, './proto/user.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as unknown as any;
const userProto = grpcObject.user_package;

if (!userProto || !userProto.User || !userProto.User.service) {
  console.error("Failed to load the User service from the proto file.");
  process.exit(1);
}
 
const server = new grpc.Server();

server.addService(userProto.User.service, {
  Register: registrationController.signup.bind(registrationController),
  CheckUser: registrationController.checkUser.bind(registrationController),
  ResendOtp: registrationController.resendOtp.bind(registrationController),
  CheckGoogleLoginUser: loginController.checkGoogleLoginUser.bind(loginController),
  CheckLoginUser: loginController.checkLoginUser.bind(loginController),
  // fetchUserProfile: userController.fetchUserProfile.bind(userController),

  AdminGetActiveUser: adminController.getActiveUser.bind(adminController),
  AdminGetBlockedUsers: adminController.getBlockedUsers.bind(adminController),
  AdminGetUserData: adminController.getUserDetails.bind(adminController),
  AdminUpdateUserStatus: adminController.updateUserStatus.bind(adminController),
});

const grpcServer = () => {
  const port = process.env.PORT || '3002';
  const Domain=process.env.NODE_ENV==='dev'?process.env.DEV_DOMAIN:process.env.PRO_DOMAIN_USER
  console.log(Domain);
  server.bindAsync(`${Domain}:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
      console.error("Error starting gRPC server:", err);
      return;
    }
    console.log(`gRPC user server started on port:${bindPort}`);
  });
};

grpcServer();