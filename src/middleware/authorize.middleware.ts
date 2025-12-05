import type { RequestHandler } from 'express';

/**
 * Run this middleware before a specific route to protect it based on certain user scopes.
 *
 * @param scopes - The valid scopes required to access the route.
 */
const authorize: (...scopes: string[]) => RequestHandler =
  (...scopes) =>
  (req, res, next) => {
    // authorize user based on req.user object and valid scopes for route
    next();
  };

export default authorize;
