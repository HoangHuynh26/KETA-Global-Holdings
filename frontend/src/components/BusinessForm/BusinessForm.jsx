import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { submitBusinessInquiry } from '../../services/inquiryApi';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import './BusinessForm.css';

const INITIAL_FORM_STATE = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  country: '',
  businessType: '',
  serviceInterest: '',
  productCategory: '',
  website: '',
  message: '',
  privacyConsent: false,
  website_hp: '' // honeypot anti-spam
};

export default function BusinessForm() {
  const { lang, t } = useLanguage();
  const f = t.form;

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  // Auto-dismiss top-right success notification after 7 seconds
  useEffect(() => {
    if (!successData) return;
    const timer = setTimeout(() => {
      setSuccessData(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [successData]);

  // Listen to product selection from B2B Showcase
  useEffect(() => {
    const handleSelectProduct = (e) => {
      if (e.detail?.product) {
        setFormData(prev => ({
          ...prev,
          productCategory: e.detail.product,
          serviceInterest: e.detail.service || prev.serviceInterest || 'Nền Tảng Kết Nối B2B Kỹ Thuật Số (Vietnam Global Marketplace Hub)'
        }));
        const formEl = document.getElementById('contact');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('keta:select-product', handleSelectProduct);
    return () => window.removeEventListener('keta:select-product', handleSelectProduct);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = f.validation.companyNameReq;
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = f.validation.contactPersonReq;
    }
    if (!formData.email.trim()) {
      newErrors.email = f.validation.emailReq;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = f.validation.emailReq;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = f.validation.phoneReq;
    }
    if (!formData.country.trim()) {
      newErrors.country = f.validation.countryReq;
    }
    if (!formData.businessType) {
      newErrors.businessType = f.validation.businessTypeReq;
    }
    if (!formData.serviceInterest) {
      newErrors.serviceInterest = f.validation.serviceInterestReq;
    }
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = f.validation.privacyReq;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Spam honeypot check
    if (formData.website_hp) {
      console.warn('Bot submission trapped by honeypot.');
      return;
    }

    if (!validate()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        businessType: formData.businessType,
        serviceInterest: formData.serviceInterest,
        productCategory: formData.productCategory.trim(),
        website: formData.website.trim(),
        message: formData.message.trim(),
        language: lang,
        privacyConsent: true,
        website_hp: formData.website_hp
      };

      const result = await submitBusinessInquiry(payload);

      setSuccessData({
        submissionId: result.submissionId || `KETA-${Date.now().toString(36).toUpperCase()}`,
        createdAt: result.createdAt || new Date().toISOString()
      });

      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        const fieldErrors = {};
        err.errors.forEach(e => {
          if (e.field) {
            fieldErrors[e.field] = e.message;
          }
        });
        setErrors(prev => ({ ...prev, ...fieldErrors }));
      }
      setSubmitError(err.message || f.errorBanner);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessData(null);
  };

  return (
    <section id="contact" className="business-form-section" aria-label="Business Registration Form">
      <div className="container">
        {/* Section Header */}
        <div className="form-intro">
          <h2 className="form-section-title">{f.headline}</h2>
          <p className="form-subheading">{f.subheading}</p>
        </div>

        {/* Two-Column Grid */}
        <div className="form-grid">
          {/* Left Column: Value Propositions */}
          <div className="form-value-props">
            <div className="value-prop-card">
              <div className="value-prop-icon">
                <Building2 size={22} />
              </div>
              <div>
                <h4 className="value-prop-title">{f.valueProps[0].title}</h4>
                <p className="value-prop-desc">{f.valueProps[0].desc}</p>
              </div>
            </div>

            <div className="value-prop-card">
              <div className="value-prop-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="value-prop-title">{f.valueProps[1].title}</h4>
                <p className="value-prop-desc">{f.valueProps[1].desc}</p>
              </div>
            </div>

            <div className="value-prop-card">
              <div className="value-prop-icon">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="value-prop-title">{f.valueProps[2].title}</h4>
                <p className="value-prop-desc">{f.valueProps[2].desc}</p>
              </div>
            </div>

            <p className="confidentiality-notice">
              {f.confidentialityNotice || f.fields?.confidentialityNotice || "Institutional Non-Disclosure & Commercial Data Privacy Guaranteed. We do not sell or distribute client corporate records."}
            </p>
          </div>

          {/* Right Column: Lead Form */}
          <div className="business-form-card">
            {submitError && (
              <div className="form-error-banner" role="alert">
                <AlertCircle size={18} color="var(--color-error)" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="actual-form">
              {/* Row 1: Company Name & Contact Person */}
              <div className="form-row">
                <div className={`form-group ${errors.companyName ? 'has-error' : ''}`}>
                  <label htmlFor="companyName" className="form-label">
                    <span>{f.fields.companyName}</span>
                    <span className="required-star">{f.fields.requiredMark}</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder={f.fields.companyNamePlaceholder}
                    className="form-input"
                    required
                  />
                  {errors.companyName && (
                    <span className="form-error-msg">{errors.companyName}</span>
                  )}
                </div>

                <div className={`form-group ${errors.contactPerson ? 'has-error' : ''}`}>
                  <label htmlFor="contactPerson" className="form-label">
                    <span>{f.fields.contactPerson}</span>
                    <span className="required-star">{f.fields.requiredMark}</span>
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder={f.fields.contactPersonPlaceholder}
                    className="form-input"
                    required
                  />
                  {errors.contactPerson && (
                    <span className="form-error-msg">{errors.contactPerson}</span>
                  )}
                </div>
              </div>

              {/* Row 2: Corporate Email & Phone */}
              <div className="form-row">
                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="email" className="form-label">
                    <span>{f.fields.email}</span>
                    <span className="required-star">{f.fields.requiredMark}</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={f.fields.emailPlaceholder}
                    className="form-input"
                    required
                  />
                  {errors.email && (
                    <span className="form-error-msg">{errors.email}</span>
                  )}
                </div>

                <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                  <label htmlFor="phone" className="form-label">
                    <span>{f.fields.phone}</span>
                    <span className="required-star">{f.fields.requiredMark}</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={f.fields.phonePlaceholder}
                    className="form-input"
                    required
                  />
                  {errors.phone && (
                    <span className="form-error-msg">{errors.phone}</span>
                  )}
                </div>
              </div>

              {/* Row 3: Country / Region & Business Entity Type */}
              <div className="form-row">
                <div className={`form-group ${errors.country ? 'has-error' : ''}`}>
                  <label htmlFor="country" className="form-label">
                    <span>{f.fields.country}</span>
                    <span className="required-star">{f.fields.requiredMark}</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder={f.fields.countryPlaceholder}
                    className="form-input"
                    required
                  />
                  {errors.country && (
                    <span className="form-error-msg">{errors.country}</span>
                  )}
                </div>

                <div className={`form-group ${errors.businessType ? 'has-error' : ''}`}>
                  <label htmlFor="businessType" className="form-label">
                    <span>{f.fields.businessType}</span>
                    <span className="required-star">{f.fields.requiredMark}</span>
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">-- {f.fields.businessTypePlaceholder} --</option>
                    {f.businessTypes.map((type, i) => (
                      <option key={i} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.businessType && (
                    <span className="form-error-msg">{errors.businessType}</span>
                  )}
                </div>
              </div>

              {/* Row 4: Service Interest & Product Category */}
              <div className="form-row">
                <div className={`form-group ${errors.serviceInterest ? 'has-error' : ''}`}>
                  <label htmlFor="serviceInterest" className="form-label">
                    <span>{f.fields.serviceInterest}</span>
                    <span className="required-star">{f.fields.requiredMark}</span>
                  </label>
                  <select
                    id="serviceInterest"
                    name="serviceInterest"
                    value={formData.serviceInterest}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">-- {f.fields.serviceInterestPlaceholder} --</option>
                    {f.servicesList.map((svc, i) => (
                      <option key={i} value={svc}>{svc}</option>
                    ))}
                  </select>
                  {errors.serviceInterest && (
                    <span className="form-error-msg">{errors.serviceInterest}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="productCategory" className="form-label">
                    <span>{f.fields.productCategory}</span>
                  </label>
                  <input
                    type="text"
                    id="productCategory"
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    placeholder={f.fields.productCategoryPlaceholder}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Row 5: Corporate Website (Optional) */}
              <div className="form-group">
                <label htmlFor="website" className="form-label">
                  <span>{f.fields.website}</span>
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder={f.fields.websitePlaceholder}
                  className="form-input"
                />
              </div>

              {/* Row 6: Requirements & Message */}
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <span>{f.fields.message}</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={f.fields.messagePlaceholder}
                  className="form-textarea"
                />
              </div>

              {/* Honeypot field against automated bot submissions */}
              <div className="hp-field" aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_hp}
                  onChange={handleChange}
                />
              </div>

              {/* Privacy Consent Checkbox */}
              <div className={`form-group consent-group ${errors.privacyConsent ? 'has-error' : ''}`}>
                <label className="consent-label">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleChange}
                    className="consent-checkbox"
                    required
                  />
                  <span>
                    {f.fields.privacyConsent} <span className="required-star">*</span>
                  </span>
                </label>
                {errors.privacyConsent && (
                  <span className="form-error-msg">{errors.privacyConsent}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="gold-btn form-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>{f.fields.submittingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{f.fields.submitBtn}</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Top-Right Success Notification Toast (rendered via Portal to prevent header occlusion) */}
      {successData && typeof document !== 'undefined' && createPortal(
        <div 
          className="toast-notification-container"
          role="status"
          aria-live="polite"
        >
          <div className="toast-notification-card">
            <div className="toast-icon-wrap">
              <CheckCircle2 size={22} />
            </div>

            <div className="toast-content">
              <div className="toast-header-row">
                <h4 className="toast-title">
                  {f.successNotification?.title || f.successModal.title}
                </h4>
                <button 
                  type="button" 
                  className="toast-close-btn"
                  onClick={closeSuccessModal}
                  aria-label={f.successNotification?.closeAria || 'Close notification'}
                >
                  <X size={16} />
                </button>
              </div>

              <p className="toast-message">
                {f.successNotification?.message || "Chúng tôi sẽ liên hệ bạn sớm trong vài phút."}
              </p>

              {successData.submissionId && (
                <div className="toast-meta">
                  <span className="toast-meta-label">
                    {f.successNotification?.submissionIdLabel || "ID"}:
                  </span>
                  <span className="toast-meta-value">{successData.submissionId}</span>
                </div>
              )}
            </div>

            {/* Visual timer countdown */}
            <div className="toast-progress-bar" />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
