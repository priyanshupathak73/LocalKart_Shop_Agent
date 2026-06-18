const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');

/**
 * Verifies JWT and attaches decoded payload to req.user
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided. Authorization required.', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return sendError(res, 'Invalid or expired token. Please log in again.', 401);
  }
};

/**
 * RBAC — restrict route to specific roles.
 * Usage: authorize('SHOPKEEPER') or authorize('SHOPKEEPER', 'DELIVERY_PARTNER')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Restricted to: ${roles.join(', ')}`,
        403
      );
    }
    next();
  };
};

module.exports = { authenticate, authorize };
