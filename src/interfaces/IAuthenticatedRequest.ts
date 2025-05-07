import { Request} from 'express';
import { IUserInterface } from './iUserInterface';
export interface AuthenticatedRequest extends Request {
    user? : IUserInterface;
  }
  