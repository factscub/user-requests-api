import { Request } from 'express';

export type UserPayload = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export interface CustomRequest extends Request {
  user?: UserPayload;
}
