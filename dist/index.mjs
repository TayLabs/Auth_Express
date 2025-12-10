// src/middleware/authenticate.middleware.ts
var authenticate = (req, res, next) => {
  next();
};
var authenticate_middleware_default = authenticate;

// src/middleware/authorize.middleware.ts
var authorize = (...scopes) => (req, res, next) => {
  next();
};
var authorize_middleware_default = authorize;

export { authenticate_middleware_default as authenticate, authorize_middleware_default as authorize };
