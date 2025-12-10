import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// src/types/AppError.ts
var AppError = class _AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, _AppError.prototype);
  }
};

// src/types/HttpStatus.enum.ts
var HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};
var HttpStatus_enum_default = HttpStatus;
var TayLabAuth = class {
  constructor(serviceName, accessTokenSecret) {
    /**
     * Middleware to parse the access token from either cookies or 'Authorize: Bearer ***' header.
     * It will validate the users scopes to check if they have access to the route based on the allowed permissions
     */
    this.authenticate = (options) => (req, res, next) => {
      try {
        const accessToken = req.headers.authorization?.split(" ")[1] || req.cookies["_access_t"];
        if (!accessToken) {
          throw new AppError(
            "Missing or Invalid Access Token",
            HttpStatus_enum_default.UNAUTHORIZED
          );
        }
        const payload = this._verifyToken(accessToken);
        if (payload.pending === "2fa" && options?.acceptPending !== "2fa") {
          throw new AppError("Finish Two Factor", HttpStatus_enum_default.UNAUTHORIZED);
        } else if (payload.pending === "passwordReset" && options?.acceptPending !== "passwordReset") {
          throw new AppError("Reset Password", HttpStatus_enum_default.UNAUTHORIZED);
        } else if (payload.pending === "emailVerification" && options?.acceptPending !== "emailVerification") {
          throw new AppError("Verify Email", HttpStatus_enum_default.UNAUTHORIZED);
        }
        let allowed = false;
        if (options?.allow) {
          for (const permission of options.allow) {
            if (payload.scopes.includes(`${this._serviceName}:${permission}`))
              allowed = true;
          }
        } else {
          allowed = true;
        }
        if (!allowed) {
          throw new AppError(
            "Not allowed to view this route",
            HttpStatus_enum_default.FORBIDDEN
          );
        }
        req.user = { id: payload.userId, scopes: payload.scopes };
        next();
      } catch (err) {
        next(err);
      }
    };
    this._serviceName = serviceName, this._accessTokenSecret = accessTokenSecret;
  }
  _verifyToken(accessToken) {
    try {
      const decodedToken = jwt.verify(
        accessToken,
        this._accessTokenSecret
      );
      return decodedToken;
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new AppError(
          "Missing or Invalid Access Token",
          HttpStatus_enum_default.UNAUTHORIZED
        );
      } else if (err instanceof TokenExpiredError) {
        throw new AppError("Token expired", HttpStatus_enum_default.UNAUTHORIZED);
      } else {
        throw new AppError(
          "An error occured, please try again later",
          HttpStatus_enum_default.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
};

export { TayLabAuth as default };
