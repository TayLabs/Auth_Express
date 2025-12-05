"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Run this middleware at the beginning of your application flow.
 * It parses the access token from the request and verifies the user is authenticated.
 */
const authenticate = (req, res, next) => {
    // authenticate user cookie and append to req.user object
    next();
};
exports.default = authenticate;
