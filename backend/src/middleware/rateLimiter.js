import rateLimit from 'express-rate-limit';

export const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 inquiries per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  validate: false, // Avoid throwing when deployed in serverless / AWS Lambda / Netlify environments
  keyGenerator: (req) => {
    return (
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['client-ip'] ||
      req.headers['x-real-ip'] ||
      req.ip ||
      '127.0.0.1'
    );
  },
  message: {
    success: false,
    message: 'Too many commercial inquiries submitted from this IP address. Please try again after 15 minutes.'
  }
});
