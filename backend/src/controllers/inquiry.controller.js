import crypto from 'crypto';
import { inquirySchema } from '../validators/inquiry.validator.js';
import { appendInquiryToSheet } from '../services/googleSheets.service.js';
import { sendInquiryEmails } from '../services/resend.service.js';

// Idempotency cache (stores submission hashes for 10 minutes to prevent double-click / network retry duplicates)
const recentSubmissions = new Map();

function cleanOldSubmissions() {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 10 * 60 * 1000) {
      recentSubmissions.delete(key);
    }
  }
}

export async function createInquiry(req, res, next) {
  try {
    cleanOldSubmissions();

    // 1. Validate payload with Zod
    const validatedData = inquirySchema.parse(req.body);

    // 2. Prevent identical double-submissions within 10 minutes
    const submissionFingerprint = `${validatedData.email}_${validatedData.companyName}_${validatedData.serviceInterest}`;
    if (recentSubmissions.has(submissionFingerprint)) {
      const existingId = recentSubmissions.get(submissionFingerprint).id;
      return res.status(200).json({
        success: true,
        submissionId: existingId,
        message: 'Your inquiry has already been received and is being processed.',
        isDuplicate: true
      });
    }

    // 3. Generate Unique Submission ID & UTC Timestamp
    const submissionId = `KETA-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const inquiryRecord = {
      ...validatedData,
      submissionId,
      createdAt,
      adminEmailStatus: 'PENDING',
      customerEmailStatus: 'PENDING'
    };

    // 4. Send Transactional Emails via Resend
    const emailResults = await sendInquiryEmails(inquiryRecord);
    inquiryRecord.adminEmailStatus = emailResults.adminEmail.success ? 'SENT' : (emailResults.adminEmail.configured ? 'FAILED' : 'UNCONFIGURED');
    inquiryRecord.customerEmailStatus = emailResults.customerEmail.success ? 'SENT' : (emailResults.customerEmail.configured ? 'FAILED' : 'UNCONFIGURED');

    // 5. Append Record to Google Sheets
    const sheetResult = await appendInquiryToSheet(inquiryRecord);

    // Save to idempotency cache
    recentSubmissions.set(submissionFingerprint, { id: submissionId, time: Date.now() });

    console.log(`[Inquiry Success] ID: ${submissionId} | Company: ${validatedData.companyName} | Sheet: ${sheetResult.success}${!sheetResult.success ? ` (${sheetResult.error || sheetResult.reason})` : ''} | Resend: ${emailResults.customerEmail.success}`);

    return res.status(201).json({
      success: true,
      submissionId,
      createdAt,
      message: 'Business inquiry successfully recorded.',
      integrations: {
        googleSheets: sheetResult.success ? 'recorded' : (sheetResult.configured ? 'failed' : 'mock_logged'),
        adminEmail: inquiryRecord.adminEmailStatus,
        customerEmail: inquiryRecord.customerEmailStatus
      }
    });

  } catch (err) {
    next(err);
  }
}

export function healthCheck(req, res) {
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'KETA Global Holdings Enterprise API'
  });
}
