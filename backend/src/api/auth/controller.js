import { registerHandler } from './handlers/registerHandler.js';
import { loginHandler } from './handlers/loginHandler.js';

// Controller layer for auth feature requests.
export const registerUser = async (req, res, next) => {
  try {
    await registerHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    await loginHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};
