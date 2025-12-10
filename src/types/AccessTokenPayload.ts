import type { UUID } from 'node:crypto';

export type AccessTokenPayload = {
	sid: string;
	userId: UUID;
	issuer: string;
	audience: string;
	pending: '2fa' | 'passwordReset' | 'emailVerification' | null;
	scopes: string[];
	issuedAt: number;
};
