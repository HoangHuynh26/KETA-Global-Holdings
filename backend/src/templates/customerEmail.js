export function renderCustomerEmail({
  submissionId,
  companyName,
  contactPerson,
  language
}) {
  const isVi = language === 'vi';

  const subject = isVi 
    ? 'KETA GLOBAL HOLDINGS – Xác Nhận Tiếp Nhận Thông Tin'
    : 'Thank You for Contacting KETA GLOBAL HOLDINGS';

  const html = isVi ? `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Montserrat', Arial, sans-serif; background-color: #0A192F; color: #FAFAFA; margin: 0; padding: 24px; }
        .container { max-width: 650px; margin: 0 auto; background-color: #0E223D; border: 1px solid #D4AF37; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0A192F 0%, #002B5B 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #D4AF37; }
        .header h1 { margin: 0; font-family: 'Playfair Display', Georgia, serif; color: #D4AF37; font-size: 26px; letter-spacing: 2px; }
        .header p { margin: 8px 0 0; color: #FAFAFA; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; }
        .content { padding: 36px 32px; font-size: 14px; line-height: 1.8; color: #E2E8F0; }
        .greeting { font-size: 16px; font-weight: 700; color: #FAFAFA; margin-bottom: 16px; }
        .tracking-box { background: rgba(10, 25, 47, 0.8); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 6px; padding: 16px 20px; margin: 24px 0; }
        .tracking-label { font-size: 11px; text-transform: uppercase; color: #94A3B8; letter-spacing: 1px; }
        .tracking-id { font-size: 18px; font-weight: 700; color: #EED68B; font-family: monospace; margin-top: 4px; }
        .signature { margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .sig-name { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; color: #EED68B; }
        .sig-title { font-size: 12px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; }
        .footer { background-color: #050E1A; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid rgba(255, 255, 255, 0.08); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>KETA GLOBAL HOLDINGS</h1>
          <p>Tinh Hoa Việt Nam. Tầm Vóc Toàn Cầu.</p>
        </div>
        <div class="content">
          <div class="greeting">Kính gửi ${contactPerson} & Quý Doanh Nghiệp ${companyName},</div>
          
          <p>
            KETA GLOBAL HOLDINGS xin chân thành cảm ơn Quý vị đã gửi thông tin đăng ký tư vấn và kết nối thương mại qua cổng thông tin chính thức của chúng tôi.
          </p>

          <p>
            Hệ thống quản trị xúc tiến thương mại quốc tế đã tiếp nhận đầy đủ hồ sơ yêu cầu của Quý doanh nghiệp:
          </p>

          <div class="tracking-box">
            <div class="tracking-label">Mã Hồ Sơ Tiếp Nhận (Submission ID)</div>
            <div class="tracking-id">${submissionId}</div>
          </div>

          <p>
            Đội ngũ chuyên viên xúc tiến thương mại và quản trị chuỗi cung ứng của KETA sẽ tiến hành rà soát các tiêu chuẩn kỹ thuật, năng lực nhà máy cũng như các quy định hải quan liên quan để đưa ra phương án xúc tiến tối ưu nhất. Chúng tôi sẽ liên hệ lại với Quý vị trong thời gian sớm nhất.
          </p>

          <p>
            Chúng tôi vinh hạnh được đồng hành cùng Quý doanh nghiệp trên hành trình kết nối thương mại bền vững và vươn tầm toàn cầu.
          </p>

          <div class="signature">
            <div class="sig-name">KIMMY NGUYỄN</div>
            <div class="sig-title">Founder & Chief Executive Officer</div>
            <div style="font-size: 12px; color: #D4AF37; margin-top: 4px;">KETA GLOBAL HOLDINGS</div>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} KETA GLOBAL HOLDINGS &bull; Ho Chi Minh City &bull; Sydney &bull; Global B2B Trade Ecosystem
        </div>
      </div>
    </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Montserrat', Arial, sans-serif; background-color: #0A192F; color: #FAFAFA; margin: 0; padding: 24px; }
        .container { max-width: 650px; margin: 0 auto; background-color: #0E223D; border: 1px solid #D4AF37; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0A192F 0%, #002B5B 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #D4AF37; }
        .header h1 { margin: 0; font-family: 'Playfair Display', Georgia, serif; color: #D4AF37; font-size: 26px; letter-spacing: 2px; }
        .header p { margin: 8px 0 0; color: #FAFAFA; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; }
        .content { padding: 36px 32px; font-size: 14px; line-height: 1.8; color: #E2E8F0; }
        .greeting { font-size: 16px; font-weight: 700; color: #FAFAFA; margin-bottom: 16px; }
        .tracking-box { background: rgba(10, 25, 47, 0.8); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 6px; padding: 16px 20px; margin: 24px 0; }
        .tracking-label { font-size: 11px; text-transform: uppercase; color: #94A3B8; letter-spacing: 1px; }
        .tracking-id { font-size: 18px; font-weight: 700; color: #EED68B; font-family: monospace; margin-top: 4px; }
        .signature { margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .sig-name { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; color: #EED68B; }
        .sig-title { font-size: 12px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; }
        .footer { background-color: #050E1A; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid rgba(255, 255, 255, 0.08); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>KETA GLOBAL HOLDINGS</h1>
          <p>Vietnam's Essence. Global Horizons.</p>
        </div>
        <div class="content">
          <div class="greeting">Dear ${contactPerson} & ${companyName},</div>
          
          <p>
            Thank you for contacting KETA GLOBAL HOLDINGS. We have formally received your corporate commercial inquiry through our global trade portal.
          </p>

          <p>
            Your inquiry parameters have been registered under the following tracking record:
          </p>

          <div class="tracking-box">
            <div class="tracking-label">Official Submission Reference ID</div>
            <div class="tracking-id">${submissionId}</div>
          </div>

          <p>
            Our trade facilitation executives and technical sourcing engineers are reviewing your specifications against our allied manufacturing base and regulatory compliance frameworks. A member of our executive partnership team will connect with your designated contact person.
          </p>

          <p>
            We look forward to exploring a high-trust, resilient, and mutually prosperous trade alliance.
          </p>

          <div class="signature">
            <div class="sig-name">KIMMY NGUYỄN</div>
            <div class="sig-title">Founder & Chief Executive Officer</div>
            <div style="font-size: 12px; color: #D4AF37; margin-top: 4px;">KETA GLOBAL HOLDINGS</div>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} KETA GLOBAL HOLDINGS &bull; Ho Chi Minh City &bull; Sydney &bull; Global B2B Trade Ecosystem
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
