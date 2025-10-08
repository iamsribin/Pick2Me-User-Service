import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import "dotenv/config";

// === Initialize Database ===
import { connectSQL } from "./config/sql-database";
connectSQL();

// === Import Controllers ===
import { RegistrationController } from "./controller/implementation/registration-controller";
import { LoginController } from "./controller/implementation/login-controller";
import { AdminController } from "./controller/implementation/admin-controller";

// === Import Services ===
import { LoginService } from "./services/implementation/login-service";
import { RegistrationService } from "./services/implementation/registration-service";
import { AdminService } from "./services/implementation/admin-service";
import { AuthService } from "./utilities/auth";

// === Import Repositories ===
import { UserRepository } from "./repositories/implementation/user-repo";
import { AdminRepository } from "./repositories/implementation/admin-repo";
import UserController from "./controller/implementation/user-controller";
import { UserService } from "./services/implementation/user-service";

// === Initialize Repos, Services, Controllers ===
const userRepo = new UserRepository();
const adminRepo = new AdminRepository();
const authService = new AuthService();

const registrationService = new RegistrationService(userRepo, authService);
const loginService = new LoginService(userRepo, authService);
const adminService = new AdminService(adminRepo);
const userService = new UserService(userRepo);

const registrationController = new RegistrationController(registrationService);
const loginController = new LoginController(loginService);
const adminController = new AdminController(adminService);
const userController = new UserController(userService);

// === Load gRPC Proto ===
const PROTO_PATH = path.resolve(__dirname, "./proto/user.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const userProto = grpcObject.user_package;

// === Validate Proto Service ===
if (!userProto?.User?.service) {
  console.error("❌ Failed to load the User service from the proto file.");
  process.exit(1);
}

// === Register gRPC Services ===
const server = new grpc.Server();

server.addService(userProto.User.service, {
  Register: registrationController.signup.bind(registrationController),
  CheckUser: registrationController.checkUser.bind(registrationController),
  ResendOtp: registrationController.resendOtp.bind(registrationController),
  CheckGoogleLoginUser: loginController.checkGoogleLoginUser.bind(loginController),
  CheckLoginUser: loginController.checkLoginUser.bind(loginController),
  fetchUserProfile: userController.fetchUserProfile.bind(userController),

  AdminGetUsersList: adminController.getUsersList.bind(adminController),
  AdminGetBlockedUsers: adminController.getBlockedUsers.bind(adminController),
  AdminGetUserData: adminController.getUserDetails.bind(adminController),
  AdminUpdateUserStatus: adminController.updateUserStatus.bind(adminController),
});

// === Start gRPC Server ===
const startGrpcServer = () => {
  const port = process.env.PORT || "3002";
  const domain =
    process.env.NODE_ENV === "dev"
      ? process.env.DEV_DOMAIN
      : process.env.PRO_DOMAIN_USER;

  const address = `${domain}:${port}`;
  console.log(`🌐 Binding gRPC server to: ${address}`);

  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
      console.error("❌ Error starting gRPC server:", err);
      return;
    }
    console.log(`✅ gRPC user service started on port: ${bindPort}`);
  });
};

startGrpcServer();
