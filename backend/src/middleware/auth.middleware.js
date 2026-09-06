import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

/**
 * Verifies JWT and attaches decoded payload to req.user
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided. Authorization required.', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const userId = decoded.userId || decoded.id;
    req.user = {
      ...decoded,
      userId,
      id: userId
    };
    next();
  } catch {
    return sendError(res, 'Invalid or expired token. Please log in again.', 401);
  }
};

/**
 * RBAC — restrict route to specific roles.
 * Supports both canonical lowercase roles (shopkeeper, delivery_agent) and legacy uppercase roles (SHOPKEEPER, DELIVERY_PARTNER).
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401);
    }
    const userRole = (req.user.role || '').toLowerCase();
    const isAllowed = roles.some((r) => {
      const target = r.toLowerCase();
      if (target === 'shopkeeper') return userRole === 'shopkeeper';
      if (target === 'delivery_partner' || target === 'delivery_agent') {
        return userRole === 'delivery_partner' || userRole === 'delivery_agent';
      }
      if (target === 'customer') return userRole === 'customer';
      if (target === 'admin') return userRole === 'admin';
      return userRole === target;
    });

    if (!isAllowed) {
      return sendError(
        res,
        `Access denied. Restricted to: ${roles.join(', ')}`,
        403
      );
    }
    next();
  };
};
