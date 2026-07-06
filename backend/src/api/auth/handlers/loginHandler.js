import { authenticateUser } from '../services/authService.js';
import { validateLoginInput } from '../validations/authValidation.js';

// Handler responsible for validating login input and delegating to the service layer.
export const loginHandler = async (req, res, next) => {
  try {
    const validation = validateLoginInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    const result = await authenticateUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Login failed' });
  }
};
