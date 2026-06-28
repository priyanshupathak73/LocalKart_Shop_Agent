const { Router } = require('express');
const { register, login, getMe, sendOtp, verifyOtp, checkPhoneSession, sendEmailOtp, verifyEmailOtp, checkEmailSession } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

// OTP Verification endpoints
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/check-phone-session', checkPhoneSession);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.get('/check-email-session', checkEmailSession);

module.exports = router;
