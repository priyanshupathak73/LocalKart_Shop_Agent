import { logger } from './logger.js';

/**
 * Sends SMS via MSG91 API (Free testing)
 * @param {string} phoneNumber - Recipient phone number (e.g. +919876543210)
 * @param {string} otpCode - Generated OTP code
 */
export const sendSMSViaMSG91 = async (phoneNumber, otpCode) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId || authKey.includes('your_msg91_auth_key') || authKey === '') {
    logger.warn(`[MSG91 SMS API] Skipping real SMS (Missing or placeholder API keys). OTP Code: ${otpCode}`);
    return false;
  }

  // Clean phone number (remove +)
  const cleanMobile = phoneNumber.replace(/\+/g, '');

  try {
    const response = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': authKey
      },
      body: JSON.stringify({
        template_id: templateId,
        mobile: cleanMobile,
        otp: otpCode
      })
    });

    const data = await response.json();
    if (response.ok && (data.type === 'success' || data.success)) {
      logger.info(`[MSG91 SMS API] SMS OTP sent successfully to ${phoneNumber}`);
      return true;
    } else {
      logger.error(`[MSG91 SMS API] Failed to send SMS: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    logger.error(`[MSG91 SMS API] Error sending SMS: ${error.message}`);
    return false;
  }
};

/**
 * Sends Email via Resend API
 * @param {string} toEmail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email body HTML
 */
export const sendEmailViaResend = async (toEmail, subject, htmlContent) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey || apiKey.includes('re_your_resend_api_key') || apiKey === '') {
    logger.warn(`[Resend Email API] Skipping real Email (Missing or placeholder API key). Subject: ${subject}`);
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: subject,
        html: htmlContent
      })
    });

    const data = await response.json();
    if (response.ok && data.id) {
      logger.info(`[Resend Email API] Email sent successfully to ${toEmail} (ID: ${data.id})`);
      return true;
    } else {
      logger.error(`[Resend Email API] Failed to send Email: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    logger.error(`[Resend Email API] Error sending Email: ${error.message}`);
    return false;
  }
};
