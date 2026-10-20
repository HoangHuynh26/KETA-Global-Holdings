import { Resend } from 'resend';
import { config } from '../config/env.js';
import { renderAdminEmail } from '../templates/adminEmail.js';
import { renderCustomerEmail } from '../templates/customerEmail.js';

let resendClient = null;

function getResendClient() {
  if (resendClient) return resendClient;
  if (!config.resendApiKey) return null;
  resendClient = new Resend(config.resendApiKey);
  return resendClient;
}

export async function sendInquiryEmails(inquiry) {
  const client = getResendClient();

  if (!client) {
    console.warn('[Resend Service] RESEND_API_KEY missing in environment. Emails simulated in logs.');
    return {
      adminEmail: { success: false, configured: false, reason: 'API key not configured' },
      customerEmail: { success: false, configured: false, reason: 'API key not configured' }
    };
  }

  const results = {
    adminEmail: { success: false, configured: true },
    customerEmail: { success: false, configured: true }
  };

  // 1. Send Admin Notification Email
  try {
    const adminTemplate = renderAdminEmail({
      ...inquiry,
      sheetUrl: config.googleSheetId 
        ? `https://docs.google.com/spreadsheets/d/${config.googleSheetId}` 
        : null
    });

    const adminResponse = await client.emails.send({
      from: config.resendFromEmail,
      to: config.adminNotificationEmail,
      subject: adminTemplate.subject,
      html: adminTemplate.html
    });

    if (adminResponse.error) {
      console.error('[Resend Admin Error]:', adminResponse.error);
      results.adminEmail = { success: false, configured: true, error: adminResponse.error.message };
    } else {
      results.adminEmail = { success: true, configured: true, id: adminResponse.data?.id };
    }
  } catch (err) {
    console.error('[Resend Admin Exception]:', err.message);
    results.adminEmail = { success: false, configured: true, error: err.message };
  }

  // 2. Send Customer Receipt Confirmation Email
  try {
    const customerTemplate = renderCustomerEmail({
      submissionId: inquiry.submissionId,
      companyName: inquiry.companyName,
      contactPerson: inquiry.contactPerson,
      language: inquiry.language
    });

    const customerResponse = await client.emails.send({
      from: config.resendFromEmail,
      to: inquiry.email,
      subject: customerTemplate.subject,
      html: customerTemplate.html
    });

    if (customerResponse.error) {
      console.error('[Resend Customer Error]:', customerResponse.error);
      results.customerEmail = { success: false, configured: true, error: customerResponse.error.message };
    } else {
      results.customerEmail = { success: true, configured: true, id: customerResponse.data?.id };
    }
  } catch (err) {
    console.error('[Resend Customer Exception]:', err.message);
    results.customerEmail = { success: false, configured: true, error: err.message };
  }

  return results;
}
