import { RequestHandler } from 'express';

declare class TayLabAuth {
    private _serviceName;
    private _accessTokenSecret;
    constructor(serviceName: string, accessTokenSecret: string);
    private _verifyToken;
    /**
     * Middleware to parse the access token from either cookies or 'Authorize: Bearer ***' header.
     * It will validate the users scopes to check if they have access to the route based on the allowed permissions
     */
    authenticate: (options?: {
        allow?: string[];
        acceptPending?: '2fa' | 'passwordReset' | 'emailVerification';
    }) => RequestHandler;
}

export { TayLabAuth as default };
