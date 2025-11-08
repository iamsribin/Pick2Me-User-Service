import { AdminController } from '../../controller/admin-controller';
import { RegistrationController } from '../../controller/auth-controller';

type Handlers = {
  registrationController: RegistrationController;
  adminController: AdminController;
};

export function createUserHandlers(controllers: Handlers) {
  const { registrationController, adminController } = controllers;

  return {};
}
