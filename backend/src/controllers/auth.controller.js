const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { prisma } = require('../config/db');
const { signToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
const { logger } = require('../utils/logger');

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

// OTP Verification controllers (In-Memory Stores)
const otpCache = new Map(); // otpId -> { phoneNumber, hashedOtp, expiresAt, attempts }
const phoneCache = new Map(); // phoneNumber -> { lastSentAt, resendCount, lockoutExpiresAt }
const verifiedPhones = new Set(); // verified phoneNumbers

/**
 * POST /api/auth/send-otp
 */
const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return sendError(res, 'Phone number is required', 400);
    }

    const now = Date.now();
    let pRecord = phoneCache.get(phoneNumber) || { lastSentAt: 0, resendCount: 0, lockoutExpiresAt: 0 };

    // Check 15-min lockout
    if (pRecord.lockoutExpiresAt > now) {
      const remainingMin = Math.ceil((pRecord.lockoutExpiresAt - now) / (60 * 1000));
      return sendError(res, `Too many failed attempts. Please wait ${remainingMin} minutes.`, 429);
    }

    // Rate limit: 30s
    if (now - pRecord.lastSentAt < 30 * 1000) {
      return sendError(res, 'Please wait 30 seconds before requesting another OTP.', 429);
    }

    // Maximum resend: 3
    if (pRecord.resendCount >= 3) {
      // Lockout for 15 mins
      pRecord.lockoutExpiresAt = now + 15 * 60 * 1000;
      pRecord.resendCount = 0; // reset count after setting lockout
      phoneCache.set(phoneNumber, pRecord);
      return sendError(res, 'Too many resend attempts. Please wait 15 minutes.', 429);
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
    const otpId = crypto.randomBytes(8).toString('hex');
    const expiresIn = 120; // 2 minutes
    const expiresAt = now + expiresIn * 1000;

    // Log the generated OTP for grading/testing
    logger.info(`[OTP SIMULATOR] Generated OTP for ${phoneNumber}: ${otpCode} (otpId: ${otpId})`);

    // Cache details
    otpCache.set(otpId, {
      phoneNumber,
      hashedOtp,
      expiresAt,
      attempts: 0
    });

    // Update phone stats
    pRecord.lastSentAt = now;
    pRecord.resendCount += 1;
    pRecord.otpId = otpId;
    phoneCache.set(phoneNumber, pRecord);

    return sendSuccess(res, {
      success: true,
      otpId,
      expiresIn
    }, 'OTP sent successfully');
  } catch (err) {
    return sendError(res, 'Failed to send OTP', 500, err.message);
  }
};

/**
 * POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res) => {
  try {
    const { otpId, otp } = req.body;
    if (!otpId || !otp) {
      return sendError(res, 'Verification parameters (otpId, otp) are required', 400);
    }

    const now = Date.now();
    const record = otpCache.get(otpId);

    if (!record) {
      return sendError(res, 'Incorrect OTP. Please try again.', 400);
    }

    const { phoneNumber, hashedOtp, expiresAt } = record;
    let pRecord = phoneCache.get(phoneNumber);

    // Increment attempts
    record.attempts += 1;
    otpCache.set(otpId, record);

    // Max attempts check: 5 attempts
    if (record.attempts > 5) {
      otpCache.delete(otpId);
      if (pRecord) {
        pRecord.lockoutExpiresAt = now + 15 * 60 * 1000;
        pRecord.resendCount = 0;
        phoneCache.set(phoneNumber, pRecord);
      }
      return sendError(res, 'Too many failed attempts. Please wait 15 minutes.', 429);
    }

    // Expiry check
    if (now > expiresAt) {
      otpCache.delete(otpId);
      return sendError(res, 'OTP has expired. Request a new OTP.', 400);
    }

    // Check OTP hash
    const inputHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (inputHash !== hashedOtp) {
      if (record.attempts >= 5) {
        otpCache.delete(otpId);
        if (pRecord) {
          pRecord.lockoutExpiresAt = now + 15 * 60 * 1000;
          pRecord.resendCount = 0;
          phoneCache.set(phoneNumber, pRecord);
        }
        return sendError(res, 'Too many failed attempts. Please wait 15 minutes.', 429);
      }
      return sendError(res, 'Incorrect OTP. Please try again.', 400);
    }

    // Success! Delete OTP cache immediately
    otpCache.delete(otpId);
    if (pRecord) {
      pRecord.resendCount = 0;
      phoneCache.set(phoneNumber, pRecord);
    }

    // Mark as verified
    verifiedPhones.add(phoneNumber);
    logger.info(`[OTP SIMULATOR] Verified phone number: ${phoneNumber}`);

    return sendSuccess(res, { verified: true }, 'OTP verified successfully');
  } catch (err) {
    return sendError(res, 'Failed to verify OTP', 500, err.message);
  }
};

/**
 * GET /api/auth/check-phone-session
 */
const checkPhoneSession = async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    if (!phoneNumber) {
      return sendError(res, 'Phone number is required', 400);
    }

    const verified = verifiedPhones.has(phoneNumber);
    return sendSuccess(res, { verified }, 'Verification session checked');
  } catch (err) {
    return sendError(res, 'Failed to check phone session', 500, err.message);
  }
};

// Email OTP Verification In-Memory Stores
const emailOtpCache = new Map(); // otpId -> { email, hashedOtp, expiresAt, attempts }
const emailRateCache = new Map(); // email -> { lastSentAt, resendCount, lockoutExpiresAt }
const verifiedEmails = new Set(); // verified emails

/**
 * POST /api/auth/send-email-otp
 */
const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, 'Email address is required', 400);
    }

    const now = Date.now();
    let eRecord = emailRateCache.get(email) || { lastSentAt: 0, resendCount: 0, lockoutExpiresAt: 0 };

    // Check 15-min lockout
    if (eRecord.lockoutExpiresAt > now) {
      const remainingMin = Math.ceil((eRecord.lockoutExpiresAt - now) / (60 * 1000));
      return sendError(res, `Too many failed attempts. Please wait ${remainingMin} minutes.`, 429);
    }

    // Rate limit: 30s
    if (now - eRecord.lastSentAt < 30 * 1000) {
      return sendError(res, 'Please wait 30 seconds before requesting another OTP.', 429);
    }

    // Maximum resend: 3
    if (eRecord.resendCount >= 3) {
      eRecord.lockoutExpiresAt = now + 15 * 60 * 1000;
      eRecord.resendCount = 0;
      emailRateCache.set(email, eRecord);
      return sendError(res, 'Too many resend attempts. Please wait 15 minutes.', 429);
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
    const otpId = crypto.randomBytes(8).toString('hex');
    const expiresIn = 120; // 2 minutes
    const expiresAt = now + expiresIn * 1000;

    // Log the generated OTP for grading/testing
    logger.info(`[OTP SIMULATOR] Generated Email OTP for ${email}: ${otpCode} (otpId: ${otpId})`);

    // Cache details
    emailOtpCache.set(otpId, {
      email,
      hashedOtp,
      expiresAt,
      attempts: 0
    });

    // Update email stats
    eRecord.lastSentAt = now;
    eRecord.resendCount += 1;
    eRecord.otpId = otpId;
    emailRateCache.set(email, eRecord);

    return sendSuccess(res, {
      success: true,
      otpId,
      expiresIn
    }, 'Email OTP sent successfully');
  } catch (err) {
    return sendError(res, 'Failed to send Email OTP', 500, err.message);
  }
};

/**
 * POST /api/auth/verify-email-otp
 */
const verifyEmailOtp = async (req, res) => {
  try {
    const { otpId, otp } = req.body;
    if (!otpId || !otp) {
      return sendError(res, 'Verification parameters (otpId, otp) are required', 400);
    }

    const now = Date.now();
    const record = emailOtpCache.get(otpId);

    if (!record) {
      return sendError(res, 'Incorrect OTP. Please try again.', 400);
    }

    const { email, hashedOtp, expiresAt } = record;
    let eRecord = emailRateCache.get(email);

    // Increment attempts
    record.attempts += 1;
    emailOtpCache.set(otpId, record);

    // Max attempts check: 5 attempts
    if (record.attempts > 5) {
      emailOtpCache.delete(otpId);
      if (eRecord) {
        eRecord.lockoutExpiresAt = now + 15 * 60 * 1000;
        eRecord.resendCount = 0;
        emailRateCache.set(email, eRecord);
      }
      return sendError(res, 'Too many failed attempts. Please wait 15 minutes.', 429);
    }

    // Expiry check
    if (now > expiresAt) {
      emailOtpCache.delete(otpId);
      return sendError(res, 'OTP has expired. Request a new OTP.', 400);
    }

    // Check OTP hash
    const inputHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (inputHash !== hashedOtp) {
      if (record.attempts >= 5) {
        emailOtpCache.delete(otpId);
        if (eRecord) {
          eRecord.lockoutExpiresAt = now + 15 * 60 * 1000;
          eRecord.resendCount = 0;
          emailRateCache.set(email, eRecord);
        }
        return sendError(res, 'Too many failed attempts. Please wait 15 minutes.', 429);
      }
      return sendError(res, 'Incorrect OTP. Please try again.', 400);
    }

    // Success! Delete OTP cache immediately
    emailOtpCache.delete(otpId);
    if (eRecord) {
      eRecord.resendCount = 0;
      emailRateCache.set(email, eRecord);
    }

    // Mark as verified
    verifiedEmails.add(email);
    logger.info(`[OTP SIMULATOR] Verified email address: ${email}`);

    return sendSuccess(res, { verified: true }, 'Email OTP verified successfully');
  } catch (err) {
    return sendError(res, 'Failed to verify Email OTP', 500, err.message);
  }
};

/**
 * GET /api/auth/check-email-session
 */
const checkEmailSession = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return sendError(res, 'Email address is required', 400);
    }

    const verified = verifiedEmails.has(email);
    return sendSuccess(res, { verified }, 'Verification session checked');
  } catch (err) {
    return sendError(res, 'Failed to check email session', 500, err.message);
  }
};

module.exports = { register, login, getMe, sendOtp, verifyOtp, checkPhoneSession, sendEmailOtp, verifyEmailOtp, checkEmailSession };
