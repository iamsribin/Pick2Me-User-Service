import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../services/interfaces/i-user-service';
import { TYPES } from '../types/container-type';
import { uploadToS3Public } from '../utils/s3';
import { UnauthorizedError } from '@Pick2Me/shared';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private readonly userService: IUserService) {}

  uploadChatFile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      if (!files || !files['file'] || !files['file'].length) {
        return res.status(400).json({ message: 'No file provided' });
      }

      const file = files['file'][0];
      const url = await uploadToS3Public(file);
      return res.status(202).json({ message: 'success', fileUrl: url });
    } catch (error) {
      _next(error);
    }
  };

  fetchUserProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache');

      const user = req.gatewayUser!;
      console.log(user);

      if (!user) throw UnauthorizedError('Missing authentication token');

      const result = await this.userService.fetchUserProfile(user.id);
      console.log(result);

      return res.status(+result.status).json(result.data);
    } catch (error) {
      _next(error);
    }
  };
}
