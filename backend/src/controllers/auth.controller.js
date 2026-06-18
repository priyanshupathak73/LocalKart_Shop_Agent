const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const { signToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, shopName, shopAddress, vehicleType } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendError(res, 'An account with this email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        ...(role === 'SHOPKEEPER' && {
          shop: {
            create: {
              name: shopName || `${name}'s Shop`,
              address: shopAddress || 'Address not set',
            },
          },
        }),
        ...(role === 'DELIVERY_PARTNER' && {
          deliveryPartner: {
            create: {
              vehicleType: vehicleType || 'MOTORCYCLE',
            },
          },
        }),
      },
      include: {
        shop: true,
        deliveryPartner: true,
      },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const { password: _pwd, ...safeUser } = user;
    return sendSuccess(res, { user: safeUser, token }, 'Account created successfully', 201);
  } catch (err) {
    return sendError(res, 'Registration failed', 500, err.message);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { shop: true, deliveryPartner: true },
    });

    if (!user) return sendError(res, 'Invalid email or password', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, 'Invalid email or password', 401);

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const { password: _pwd, ...safeUser } = user;
    return sendSuccess(res, { user: safeUser, token }, 'Login successful');
  } catch (err) {
    return sendError(res, 'Login failed', 500, err.message);
  }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { shop: true, deliveryPartner: true },
    });
    if (!user) return sendError(res, 'User not found', 404);
    const { password: _pwd, ...safeUser } = user;
    return sendSuccess(res, safeUser, 'Profile fetched');
  } catch (err) {
    return sendError(res, 'Failed to fetch user', 500, err.message);
  }
};

module.exports = { register, login, getMe };
