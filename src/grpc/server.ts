import * as grpc from '@grpc/grpc-js';
import { userServiceDescriptor } from '@Pick2Me/shared/protos';
import { createUserHandlers } from './handlers/user-handlers';
import container from '@/config/inversify.config';
import { TYPES } from '@/types/container-type';
import { AdminController } from '@/controller/admin-controller';
import { RegistrationController } from '@/controller/auth-controller';

const registrationController = container.get<RegistrationController>(TYPES.RegistrationController);
const adminController = container.get<AdminController>(TYPES.AdminController);

if (!userServiceDescriptor) {
  console.error('userServiceDescriptor is missing. Inspect loaded proto package.');
  process.exit(1);
}

const handlers = createUserHandlers({
  registrationController,
  adminController,
});

export const startGrpcServer = () => {
  try {
    const server = new grpc.Server();

    // Register user service gRPC functions
    server.addService(userServiceDescriptor, handlers);

    server.bindAsync(
      process.env.GRPC_URL as string,
      grpc.ServerCredentials.createInsecure(),
      () => {
        console.log(`GRPC server for user service running on port ${process.env.GRPC_URL}`);
      }
    );
  } catch (err) {
    console.log(err);
  }
};
