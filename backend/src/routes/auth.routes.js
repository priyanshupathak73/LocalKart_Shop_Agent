import { Router } from 'express';
import { register, login, getMe, sendOtp, verifyOtp, checkPhoneSession, sendEmailOtp, verifyEmailOtp, checkEmailSession, checkEmailExists } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

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
router.get('/check-email-exists', checkEmailExists);

export default router;
