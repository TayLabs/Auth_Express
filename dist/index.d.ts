import { RequestHandler } from 'express';

/**
 * Run this middleware at the beginning of your application flow.
 * It parses the access token from the request and verifies the user is authenticated.
 */
declare const authenticate: RequestHandler;

/**
 * Run this middleware before a specific route to protect it based on certain user scopes.
 *
 * @param scopes - The valid scopes required to access the route.
 */
declare const authorize: (...scopes: string[]) => RequestHandler;

export { authenticate, authorize };
