// Validate incoming auth payloads before business logic is executed.
export const validateRegisterInput = (payload) => {
  const errors = [];
 
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { email, password ,username } = payload;

if (!username || typeof username !== "string" ) {
  errors.push("Name must be a string with at least 2 characters.");
}

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  return { valid: errors.length === 0, errors };
};

export const validateLoginInput = (payload) => {
  const errors = [];

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { email, password } = payload;

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  return { valid: errors.length === 0, errors };
};
