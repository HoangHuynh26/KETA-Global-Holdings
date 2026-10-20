# KETA GLOBAL HOLDINGS
### Premier International B2B Corporate Trade Gateway | Full-Stack Production Implementation

> **"VIETNAM’S ESSENCE. GLOBAL HORIZONS."**  
> *Tinh Hoa Việt Nam. Tầm Vóc Toàn Cầu.*

---

## 1. Executive Overview

**KETA Global Holdings** is an institutional-grade B2B corporate trade promotion ecosystem connecting verified, international-standard Vietnamese manufacturers with multinational supermarket chains, wholesale importers, and global supply chains across North America, Europe, Australia, and the Middle East.

This repository contains the complete full-stack production codebase, featuring:
- **Corporate Luxury Editorial Frontend**: Built with React (Vite), featuring architectural staircase flanking geometry, GSAP ScrollTrigger storytelling across 8 strategic trade pillars, interactive factory auditing scorecards, logistics risk mitigation matrices, and seamless English/Vietnamese localization.
- **Enterprise Security Backend**: Built with Node.js and Express, implementing Zod data validation, formula-injection sanitization, honeypot anti-spam defense, rate limiting, and dual asynchronous integrations with Google Sheets API and Resend transactional email services.

---

## 2. Architecture & Tech Stack

```
.
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       ├── logo/              # Brand SVG marks & monogram symbols
│   │       └── images/            # High-resolution editorial photography
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/            # Fixed luxury header & mobile drawer
│   │   │   ├── Hero/              # Stepped staircase geometric portal
│   │   │   ├── TrustBar/          # 4 interactive empirical metric cards
│   │   │   ├── Services/          # 8-chapter scrollytelling + Scorecard + Matrix
│   │   │   ├── WhyVietnam/        # Macro geopolitical & supply chain thesis
│   │   │   ├── Founder/           # CEO Kimmy Nguyễn editorial letter & vision
│   │   │   ├── BusinessForm/      # B2B inquiry form with validation & modal
│   │   │   ├── Footer/            # Footer reveal effect & corporate coordinates
│   │   │   └── BackToTop/         # Accessible smooth return button
│   │   ├── context/
│   │   │   └── LanguageContext.jsx # React Context for EN / VI switching
│   │   ├── locales/
│   │   │   ├── en.js              # English dictionary (default)
│   │   │   └── vi.js              # Vietnamese dictionary (single source of truth)
│   │   ├── services/
│   │   │   └── inquiryApi.js      # Native Fetch API client
│   │   ├── styles/
│   │   │   ├── variables.css      # Design tokens (Deep Navy, Metallic Gold)
│   │   │   └── globals.css        # Base styling, WCAG focus rings, utilities
│   │   ├── App.jsx                # Unified component hierarchy
│   │   └── main.jsx               # Entrypoint & provider wrapping
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/env.js          # Environment variable parser
│   │   ├── controllers/           # Idempotent inquiry controller
│   │   ├── middleware/            # Rate limiting, helmet security, error handler
│   │   ├── routes/                # Express API routes (/api/inquiries, /api/health)
│   │   ├── services/
│   │   │   ├── googleSheets.service.js  # JWT Google Sheets append
│   │   │   └── resend.service.js        # Transactional email dispatcher
│   │   ├── templates/
│   │   │   ├── adminEmail.js      # Executive inquiry alert template
│   │   │   └── customerEmail.js   # Multilingual buyer confirmation receipt
│   │   ├── validators/            # Zod validation & spreadsheet sanitization
│   │   ├── app.js                 # Express application assembly
│   │   └── server.js              # Server entrypoint
│   ├── .env.example
│   └── package.json
└── README.md
```

### Technology Highlights
- **Frontend**: React 19, Vite, GSAP + ScrollTrigger, Lucide Icons, Vanilla CSS (CSS Modules compatible). Zero TypeScript as required. Native Fetch API without Axios.
- **Backend**: Node.js (v18+ LTS), Express 4, Zod, Googleapis, Resend SDK, Helmet, CORS, Express-Rate-Limit.
- **Color Palette**:
  - Deep Navy Blue: `#0A192F` / `#002B5B`
  - Metallic Gold: `#D4AF37` / `#C5A059`
  - Porcelain White: `#FAFAFA`
  - Deep Surface Navy: `#050E1A` / `#0E223D`
- **Typography**:
  - Headings & Editorial Quotes: `Playfair Display`
  - Body, Metrics & Navigation: `Montserrat`

---

## 3. Quick Start & Local Development

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Step 1: Install & Start Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at: `http://localhost:5173/`

### Step 2: Install & Start Backend
Open a second terminal window:
```bash
cd backend
npm install
npm run dev
```
The backend will start at: `http://localhost:5000/`  
Health check endpoint: `http://localhost:5000/api/health`

---

## 4. Google Sheets API Integration Setup

To record commercial inquiries directly into Google Sheets in production:

1. **Create a Google Cloud Project**:
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a project (e.g., `keta-trade-platform`).
2. **Enable Google Sheets API**:
   - Go to **APIs & Services** > **Library**.
   - Search for **Google Sheets API** and click **Enable**.
3. **Generate Service Account Credentials**:
   - Go to **APIs & Services** > **Credentials**.
   - Click **Create Credentials** > **Service Account**.
   - Assign the role **Project > Editor** or Sheets-specific editor.
   - Once created, open the service account, go to **Keys** > **Add Key** > **Create new key** (JSON format).
   - Download the JSON key file.
4. **Create & Share the Spreadsheet**:
   - Create a new Google Spreadsheet in Google Drive (e.g., `KETA Global - Commercial Inquiries`).
   - Copy the Spreadsheet ID from the URL:
     `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`
   - Share the spreadsheet with the `client_email` from your JSON key (grant **Editor** permissions).
5. **Configure Backend Environment**:
   In `backend/.env`:
   ```env
   GOOGLE_SHEET_ID=your_spreadsheet_id_here
   GOOGLE_SHEET_TAB_NAME=BusinessInquiries
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@keta-trade-platform.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...your_key_here...\n-----END PRIVATE KEY-----\n"
   ```

*Note: If credentials are not configured during development, the backend automatically logs inquiries to memory and responds gracefully without throwing errors.*

---

## 5. Resend API Email Integration Setup

To dispatch transactional emails for every new business submission:

1. **Create a Resend Account**:
   - Sign up at [Resend.com](https://resend.com/).
2. **Verify Corporate Domain**:
   - Go to **Domains** > **Add Domain** (e.g., `ketaglobal.com`).
   - Add the specified DKIM and SPF records to your DNS provider (Cloudflare, GoDaddy, etc.).
   - Wait for domain verification.
3. **Generate API Key**:
   - Go to **API Keys** > **Create API Key**.
   - Set permission to **Sending access**.
4. **Configure Backend Environment**:
   In `backend/.env`:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=inquiries@ketaglobal.com
   ADMIN_NOTIFICATION_EMAIL=partnerships@ketaglobal.com
   ```

### Dispatched Transactional Emails
- **Email A (Admin Dossier)**: Subject `[KETA GLOBAL HOLDINGS] New Business Inquiry — {companyName}` detailing full contact coordinates, volume mandates, service pillars, submission ID, and direct spreadsheet hyperlink.
- **Email B (Customer Receipt)**: Dispatched in the customer's selected language (`en` or `vi`), signed by CEO Kimmy Nguyễn, acknowledging confidential receipt and providing an official tracking ID.

---

## 6. Production Deployment Guide

### Deploying Frontend to Vercel
1. Push the code to GitHub/GitLab.
2. In the [Vercel Dashboard](https://vercel.com/):
   - Click **Add New** > **Project** and select repository.
   - Set **Root Directory** to `frontend`.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add Environment Variable:
     - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com`
3. Click **Deploy**.

### Deploying Backend to Render / Railway / Node.js Host
1. In the [Render Dashboard](https://render.com/):
   - Click **New** > **Web Service**.
   - Select your repository.
   - Set **Root Directory** to `backend`.
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
2. Add the following **Environment Variables**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend.vercel.app`
   - `GOOGLE_SHEET_ID`: (your sheet ID)
   - `GOOGLE_SHEET_TAB_NAME`: `BusinessInquiries`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: (service account email)
   - `GOOGLE_PRIVATE_KEY`: (private key with escaped `\n`)
   - `RESEND_API_KEY`: (Resend API key)
   - `RESEND_FROM_EMAIL`: `inquiries@ketaglobal.com`
   - `ADMIN_NOTIFICATION_EMAIL`: `partnerships@ketaglobal.com`
3. Deploy the service.

---

## 7. Security, Integrity & Performance

- **Spreadsheet Formula Injection Protection**: User inputs prefixed with `=`, `+`, `-`, `@` are automatically escaped with leading single quotes before appending to Google Sheets.
- **Bot Defense (Honeypot)**: Hidden input field catches automated spiders, terminating malicious spam instantly.
- **Rate Limiting**: Configured with `express-rate-limit` allowing up to 20 inquiries per 15 minutes per IP.
- **Idempotency Window**: 10-minute duplicate suppression prevents double-clicks and repeated submissions.
- **Enterprise Headers**: Hardened with `helmet` and strict CORS allowlists.
- **Accessibility & WCAG 2.2 AA**: Visible focus outlines, screen-reader semantic roles, high-contrast text ratios, full keyboard traversal, and `prefers-reduced-motion` compliance.

---

## 8. License & Commercial Rights

&copy; KETA GLOBAL HOLDINGS. All Rights Reserved.  
Crafted for sovereign international B2B trade facilitation.
