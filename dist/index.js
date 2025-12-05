"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const authenticate_middleware_1 = __importDefault(require("./middleware/authenticate.middleware"));
exports.authenticate = authenticate_middleware_1.default;
const authorize_middleware_1 = __importDefault(require("./middleware/authorize.middleware"));
exports.authorize = authorize_middleware_1.default;
