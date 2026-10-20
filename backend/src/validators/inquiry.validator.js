import { z } from 'zod';

// Utility to sanitize strings against spreadsheet formula injection (=, +, -, @, \t, \r)
export function sanitizeForSpreadsheet(val) {
  if (typeof val !== 'string') return val == null ? '' : String(val);
  const trimmed = val.trim();
  if (['=', '+', '-', '@', '\t', '\r'].some(char => trimmed.startsWith(char))) {
    return `'${trimmed}`;
  }
  return trimmed;
}

export const inquirySchema = z.object({
  companyName: z.string({
    required_error: 'Company name is required'
  }).trim().min(1, 'Company name is required').max(200),

  contactPerson: z.string({
    required_error: 'Contact person is required'
  }).trim().min(1, 'Contact person is required').max(150),

  email: z.string({
    required_error: 'Business email is required'
  }).trim().email('Invalid corporate email address').max(150),

  phone: z.string({
    required_error: 'Phone number is required'
  }).trim().min(3, 'Phone number must be at least 3 characters').max(50),

  country: z.string({
    required_error: 'Country is required'
  }).trim().min(1, 'Country is required').max(100),

  businessType: z.string({
    required_error: 'Business entity type is required'
  }).trim().min(1, 'Business entity type is required').max(100),

  serviceInterest: z.string({
    required_error: 'Service of interest is required'
  }).trim().min(1, 'Service of interest is required').max(150),

  productCategory: z.string().nullable().optional().default('').transform(val => val ? val.trim() : ''),
  website: z.string().nullable().optional().default('').transform(val => val ? val.trim() : ''),
  message: z.string().nullable().optional().default('').transform(val => val ? val.trim() : ''),

  language: z.string().optional().default('en').transform(val => {
    const s = String(val || '').toLowerCase().trim();
    return s.startsWith('vi') ? 'vi' : 'en';
  }),

  privacyConsent: z.any().refine(val => val === true || val === 'true' || val === 1, {
    message: 'Privacy consent is mandatory'
  }).transform(() => true),

  // Honeypot anti-spam field (must be empty if present)
  website_hp: z.any().optional().nullable().refine(val => !val || String(val).trim() === '', {
    message: 'Spam detection triggered'
  }).transform(() => '')
});
