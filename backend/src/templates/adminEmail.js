export function renderAdminEmail({
  submissionId,
  createdAt,
  companyName,
  contactPerson,
  email,
  phone,
  country,
  businessType,
  serviceInterest,
  productCategory,
  website,
  message,
  language,
  sheetUrl
}) {
  return {
    subject: `[KETA GLOBAL HOLDINGS] New Business Inquiry — ${companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; background-color: #0A192F; color: #FAFAFA; margin: 0; padding: 24px; }
          .container { max-width: 650px; margin: 0 auto; background-color: #0E223D; border: 1px solid #D4AF37; border-radius: 8px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0A192F 0%, #002B5B 100%); padding: 28px; text-align: center; border-bottom: 2px solid #D4AF37; }
          .header h1 { margin: 0; font-family: 'Playfair Display', Georgia, serif; color: #D4AF37; font-size: 24px; letter-spacing: 2px; }
          .header p { margin: 6px 0 0; color: #FAFAFA; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; }
          .content { padding: 32px; font-size: 14px; line-height: 1.6; color: #E2E8F0; }
          .badge { display: inline-block; background-color: rgba(212, 175, 55, 0.15); color: #EED68B; border: 1px solid #D4AF37; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; }
          th { text-align: left; padding: 10px 14px; background-color: rgba(0, 43, 91, 0.6); color: #D4AF37; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(212, 175, 55, 0.3); width: 35%; }
          td { padding: 10px 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); color: #FAFAFA; font-size: 13px; }
          .message-box { background-color: #0A192F; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 6px; padding: 18px; margin-top: 10px; color: #FAFAFA; font-style: italic; }
          .footer { background-color: #050E1A; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid rgba(255, 255, 255, 0.08); }
          .btn { display: inline-block; background: #D4AF37; color: #0A192F; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: 700; font-size: 12px; text-transform: uppercase; margin-top: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>KETA GLOBAL HOLDINGS</h1>
            <p>Institutional Trade Facilitation</p>
          </div>
          <div class="content">
            <span class="badge">New B2B Corporate Lead Received</span>
            <p>A new commercial business inquiry has been recorded through the global portal.</p>
            
            <table>
              <tr><th>Submission ID</th><td><strong>${submissionId}</strong></td></tr>
              <tr><th>Timestamp (UTC)</th><td>${createdAt}</td></tr>
              <tr><th>Company Name</th><td><strong>${companyName}</strong></td></tr>
              <tr><th>Contact Person</th><td>${contactPerson}</td></tr>
              <tr><th>Corporate Email</th><td><a href="mailto:${email}" style="color: #EED68B;">${email}</a></td></tr>
              <tr><th>Phone / WhatsApp</th><td><a href="tel:${phone}" style="color: #EED68B;">${phone}</a></td></tr>
              <tr><th>Country / Region</th><td>${country}</td></tr>
              <tr><th>Entity Type</th><td>${businessType}</td></tr>
              <tr><th>Service of Interest</th><td><strong>${serviceInterest}</strong></td></tr>
              <tr><th>Product Category</th><td>${productCategory || 'N/A'}</td></tr>
              <tr><th>Corporate Website</th><td>${website ? `<a href="${website}" target="_blank" style="color: #EED68B;">${website}</a>` : 'N/A'}</td></tr>
              <tr><th>Form Language</th><td>${(language || 'en').toUpperCase()}</td></tr>
            </table>

            <div style="margin-top: 20px;">
              <strong style="color: #D4AF37; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Project Mandate / Message:</strong>
              <div class="message-box">
                ${message ? message.replace(/\n/g, '<br>') : 'No additional notes provided.'}
              </div>
            </div>

            ${sheetUrl ? `
              <div style="text-align: center; margin-top: 24px;">
                <a href="${sheetUrl}" class="btn" target="_blank">Open Master Google Sheet</a>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            KETA GLOBAL HOLDINGS &bull; Confidential Executive Notification &bull; Internal Distribution Only
          </div>
        </div>
      </body>
      </html>
    `
  };
}
