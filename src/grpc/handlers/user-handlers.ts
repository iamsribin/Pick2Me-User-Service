import { GrpcController } from '@/controller/grpc-controller';

type Handlers = {
  grpcController: GrpcController;
};

export function createUserHandlers(controllers: Handlers) {
  const { grpcController } = controllers;

  return {
    FetchUserInfoForBookingRide: grpcController.fetchUserInfoForBookingRide,
  };
}
