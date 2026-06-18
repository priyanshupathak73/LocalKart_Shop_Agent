const { sendError } = require('../utils/response');

/**
 * Zod validation middleware factory.
 * Validates req.body against the provided Zod schema.
 * Returns 422 with field-level errors on failure.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return sendError(res, 'Validation failed', 422, errors);
    }
    req.body = result.data; // use parsed + coerced data
    next();
  };
};

module.exports = { validate };
