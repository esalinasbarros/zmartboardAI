import { Request } from 'express';
import { User } from '@prisma/client';

// Esto viene del auth guard y permite acceder a estos datos en una request sin hacer llamadas a la BDD

export interface AuthenticatedRequest extends Request {
  user: Omit<User, 'password'>;
}