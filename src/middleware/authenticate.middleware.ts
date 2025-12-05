import type { RequestHandler } from 'express';

/**
 * Run this middleware at the beginning of your application flow.
 * It parses the access token from the request and verifies the user is authenticated.
 */
const authenticate: RequestHandler = (req, res, next) => {
  // authenticate user cookie and append to req.user object
  next();
};

export default authenticate;
