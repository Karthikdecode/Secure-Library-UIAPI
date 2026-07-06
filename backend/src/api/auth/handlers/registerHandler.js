import { createUser } from '../services/authService.js';
import { validateRegisterInput } from '../validations/authValidation.js';

// Handler responsible for validating registration input and delegating to the service layer.
export const registerHandler = async (req, res, next) => {
  try {
    const validation = validateRegisterInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    const result = await createUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Registration failed' });
  }
};
