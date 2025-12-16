import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';
import type { RequestHandler } from 'express';
import { AccessTokenPayload } from './types/AccessTokenPayload';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export default class TayLabAuth {
	private _serviceName: string;
	private _accessTokenSecret: string;

	constructor(serviceName: string, accessTokenSecret: string) {
		(this._serviceName = serviceName),
			(this._accessTokenSecret = accessTokenSecret);
	}

	private _verifyToken(accessToken: string): AccessTokenPayload {
		try {
			const decodedToken = jwt.verify(
				accessToken,
				this._accessTokenSecret
			) as AccessTokenPayload;

			return decodedToken;
		} catch (err) {
			if (err instanceof JsonWebTokenError) {
				throw new AppError('Invalid Access Token', HttpStatus.UNAUTHORIZED);
			} else if (err instanceof TokenExpiredError) {
				throw new AppError('Token expired', HttpStatus.UNAUTHORIZED);
			} else {
				throw new AppError(
					'An error occured, please try again later',
					HttpStatus.INTERNAL_SERVER_ERROR
				);
			}
		}
	}

	/**
	 * Middleware to parse the access token from either cookies or 'Authorize: Bearer ***' header.
	 * It will validate the users scopes to check if they have access to the route based on the allowed permissions
	 */
	public authenticate: (options?: {
		allow?: string[];
		acceptPending?: '2fa' | 'passwordReset' | 'emailVerification';
	}) => RequestHandler = (options) => (req, res, next) => {
		try {
			// Parse Access Token
			const accessToken: string | undefined =
				req.headers.authorization?.split(' ')[1] || req.cookies['_access_t'];

			if (!accessToken) {
				throw new AppError('Missing Access Token', HttpStatus.UNAUTHORIZED);
			}

			// Verify Access Token
			const payload = this._verifyToken(accessToken);

			if (payload.pending === '2fa' && options?.acceptPending !== '2fa') {
				throw new AppError('Finish Two Factor', HttpStatus.UNAUTHORIZED);
			} else if (
				payload.pending === 'passwordReset' &&
				options?.acceptPending !== 'passwordReset'
			) {
				throw new AppError('Reset Password', HttpStatus.UNAUTHORIZED);
			} else if (
				payload.pending === 'emailVerification' &&
				options?.acceptPending !== 'emailVerification'
			) {
				throw new AppError('Verify Email', HttpStatus.UNAUTHORIZED);
			}

			// check user scopes
			let allowed = false;
			if (options?.allow) {
				for (const permission of options.allow) {
					if (payload.scopes.includes(`${this._serviceName}:${permission}`))
						allowed = true;
				}
			} else {
				allowed = true; // if no scopes are listed default to allowed (true)
			}
			if (!allowed) {
				throw new AppError(
					'Not allowed to view this route',
					HttpStatus.FORBIDDEN
				);
			}

			req.user = { id: payload.userId, scopes: payload.scopes };

			next();
		} catch (err) {
			next(err);
		}
	};
}
