import { config } from '../config/env.js';
import { sanitizeForSpreadsheet } from '../validators/inquiry.validator.js';

/**
 * Appends a new inquiry record to Google Sheets via the Google Apps Script Web App.
 *
 * @param {Object} inquiry - Sanitized inquiry data object
 * @returns {Promise<{success: boolean, configured: boolean, submissionId?: string, duplicate?: boolean, error?: string, reason?: string}>}
 */
export async function appendInquiryToSheet(inquiry) {
  if (!config.googleSheetApiUrl) {
    console.warn('[Google Sheets] GOOGLE_SHEET_API_URL missing in environment. Record logged in memory only.');
    return {
      success: false,
      configured: false,
      reason: 'GOOGLE_SHEET_API_URL not configured in .env'
    };
  }

  try {
    const payload = {
      action: 'appendInquiry',
      apiSecret: config.googleSheetApiSecret,
      submissionId: inquiry.submissionId,
      createdAt: inquiry.createdAt || new Date().toISOString(),
      companyName: sanitizeForSpreadsheet(inquiry.companyName),
      contactPerson: sanitizeForSpreadsheet(inquiry.contactPerson),
      email: sanitizeForSpreadsheet(inquiry.email),
      phone: sanitizeForSpreadsheet(inquiry.phone),
      country: sanitizeForSpreadsheet(inquiry.country),
      businessType: sanitizeForSpreadsheet(inquiry.businessType),
      serviceInterest: sanitizeForSpreadsheet(inquiry.serviceInterest),
      productCategory: sanitizeForSpreadsheet(inquiry.productCategory || ''),
      website: sanitizeForSpreadsheet(inquiry.website || ''),
      message: sanitizeForSpreadsheet(inquiry.message || ''),
      language: sanitizeForSpreadsheet(inquiry.language || 'en'),
      privacyConsent: inquiry.privacyConsent === true,
      website_hp: inquiry.website_hp || ''
    };

    const response = await fetch(config.googleSheetApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(6000)
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      if (data.message === 'Unauthorized') {
        console.error('[Google Apps Script Auth Error] Request unauthorized. Ensure API_SECRET in Google Apps Script Script Properties matches GOOGLE_SHEET_API_SECRET in backend/.env.');
      } else {
        console.error('[Google Apps Script Error]:', data.message);
      }
      return {
        success: false,
        configured: true,
        error: data.message || 'Failed to append to Google Sheet'
      };
    }

    // If emails were already processed and have concrete statuses, update columns 15 & 16 in the sheet
    const hasStatusUpdate = 
      (inquiry.adminEmailStatus && inquiry.adminEmailStatus !== 'PENDING') ||
      (inquiry.customerEmailStatus && inquiry.customerEmailStatus !== 'PENDING');

    if (hasStatusUpdate) {
      updateEmailStatusesInSheet({
        submissionId: inquiry.submissionId,
        adminEmailStatus: inquiry.adminEmailStatus,
        customerEmailStatus: inquiry.customerEmailStatus
      }).catch(err => {
        console.warn('[Google Sheets] Email status sync notice:', err.message);
      });
    }

    return {
      success: true,
      configured: true,
      submissionId: data.submissionId,
      duplicate: !!data.duplicate
    };
  } catch (err) {
    console.error('[Google Sheets Service Error]:', err.message);
    return {
      success: false,
      configured: true,
      error: err.message
    };
  }
}

/**
 * Updates the email delivery statuses (Admin & Customer) for a given inquiry row in Google Sheets.
 *
 * @param {Object} params
 * @param {string} params.submissionId
 * @param {string} params.adminEmailStatus - 'PENDING' | 'SENT' | 'FAILED' | 'UNCONFIGURED'
 * @param {string} params.customerEmailStatus - 'PENDING' | 'SENT' | 'FAILED' | 'UNCONFIGURED'
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function updateEmailStatusesInSheet({ submissionId, adminEmailStatus, customerEmailStatus }) {
  if (!config.googleSheetApiUrl) {
    return { success: false, configured: false };
  }

  const allowed = ['PENDING', 'SENT', 'FAILED', 'UNCONFIGURED'];
  const safeAdminStatus = allowed.includes(adminEmailStatus) ? adminEmailStatus : 'UNCONFIGURED';
  const safeCustomerStatus = allowed.includes(customerEmailStatus) ? customerEmailStatus : 'UNCONFIGURED';

  try {
    const payload = {
      action: 'updateEmailStatuses',
      apiSecret: config.googleSheetApiSecret,
      submissionId,
      adminEmailStatus: safeAdminStatus,
      customerEmailStatus: safeCustomerStatus
    };

    const response = await fetch(config.googleSheetApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(4000)
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('[Google Sheets Status Update Error]:', err.message);
    return { success: false, error: err.message };
  }
}
