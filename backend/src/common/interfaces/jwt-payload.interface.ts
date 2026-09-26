import { UserRole } from '../../users/types';

export interface JwtPayload {
  userId: number;
  username: string;
  role: UserRole;
}
