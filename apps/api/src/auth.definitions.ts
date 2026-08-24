import { UserRole } from '@prisma/client';

export interface AuthPayload {
  id: number;
  username: string;
  role: UserRole;
  telegramId: string | null;
}
