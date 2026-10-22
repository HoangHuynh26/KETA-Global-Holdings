import dotenv from 'dotenv';
import path from 'path';

// Load default .env from current directory
dotenv.config();
// Fallback: Also try loading from backend/.env if running from repository root
try {
  dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
} catch (e) {
  // Ignored in production/serverless
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Google Sheets Apps Script Web App
  googleSheetApiUrl: (process.env.GOOGLE_SHEET_API_URL || '').trim(),
  googleSheetApiSecret: (process.env.GOOGLE_SHEET_API_SECRET || process.env.API_SECRET || '').trim(),
  googleSheetId: (process.env.GOOGLE_SHEET_ID || '').trim(),

  // Resend Email API
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'inquiries@ketaglobal.com',
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@ketaglobal.com'
};
