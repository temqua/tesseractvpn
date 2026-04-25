import type { Payment, User } from '@prisma/client';

export type VPNUser = User & {
	createdAt: string;
	payer: User | null;
	payments: Payment[];
	dependants: User[];
	referrer: User | null;
	referrals: User[];
};
