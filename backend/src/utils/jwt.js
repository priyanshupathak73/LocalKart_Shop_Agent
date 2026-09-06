import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretlocalkartkey12345!';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const signToken = (payload) => {
  let tokenPayload;
  if (payload && typeof payload === 'object') {
    const userId = payload.userId || payload.id || (payload._id ? payload._id.toString() : '');
    tokenPayload = {
      userId,
      id: userId,
      email: payload.email || '',
      role: payload.role || '',
      name: payload.name || '',
      ...payload
    };
  } else {
    const id = payload ? payload.toString() : '';
    tokenPayload = { userId: id, id };
  }
  return jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
