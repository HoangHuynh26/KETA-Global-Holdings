import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Mail, Globe, Shield } from 'lucide-react';
import './Footer.css';

export default function Footer({ onGoToShowcaseAdmin }) {
  const { t } = useLanguage();
  const f = t.footer;
  const footerRef = useRef(null);
  const spacerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (footerRef.current) {
      resizeObserver.observe(footerRef.current);
    }
    window.addEventListener('resize', updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  useEffect(() => {
    if (!spacerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearBottom(entry.isIntersecting);
      },
      {
        rootMargin: '400px 0px 0px 0px',
        threshold: 0
      }
    );

    observer.observe(spacerRef.current);

    return () => observer.disconnect();
  }, [footerHeight]);

  const scrollTo = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Spacer in document flow to create room for the fixed footer curtain reveal */}
      <div 
        ref={spacerRef}
        className="footer-reveal-spacer" 
        style={{ height: footerHeight ? `${footerHeight}px` : 'auto' }} 
        aria-hidden="true" 
      />

      <footer 
        ref={footerRef}
        className={`site-footer ${isNearBottom ? 'is-active-reveal' : ''}`} 
        aria-label="Corporate Footer"
      >
        <div className="footer-glow" aria-hidden="true" />

        <div className="container">
          <div className="footer-top-grid">
            {/* Column 1: Brand Summary */}
            <div className="footer-brand-col">
              <img 
                src="/assets/logo/keta-logo.png" 
                alt="KETA GLOBAL" 
                className="footer-logo-img" 
              />
              <div className="footer-tagline">{f.tagline}</div>
              <p className="footer-desc">{f.desc}</p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">{f.quickLinks}</h4>
              <ul className="footer-nav-list">
                <li>
                  <a href="#home" className="footer-nav-link" onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>
                    {t.nav.home}
                  </a>
                </li>
                <li>
                  <a href="#services" className="footer-nav-link" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>
                    {t.nav.services}
                  </a>
                </li>
                <li>
                  <a href="#why-vietnam" className="footer-nav-link" onClick={(e) => { e.preventDefault(); scrollTo('why-vietnam'); }}>
                    {t.nav.whyVietnam}
                  </a>
                </li>
                <li>
                  <a href="#b2b-showcase" className="footer-nav-link" onClick={(e) => { e.preventDefault(); scrollTo('b2b-showcase'); }}>
                    {t.nav.b2bShowcase || 'Showcase'}
                  </a>
                </li>
                <li>
                  <a href="#founder" className="footer-nav-link" onClick={(e) => { e.preventDefault(); scrollTo('founder'); }}>
                    {t.nav.founder}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-nav-link" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
                    {t.nav.contact}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Services Jump Links */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">{f.servicesTitle}</h4>
              <ul className="footer-nav-list">
                {(f.serviceLinks || [
                  { id: "service-01", label: "01. Trade Promotion" },
                  { id: "service-02", label: "02. Global Market Expo" },
                  { id: "service-04", label: "04. Compliance & Certs" },
                  { id: "service-05", label: "05. Factory Audits & QA" },
                  { id: "service-06", label: "06. Global Shipping" },
                  { id: "service-07", label: "07. Marketplace Hub" }
                ]).map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="footer-nav-link" onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Coordinates */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">{f.contactTitle}</h4>
              <div className="footer-contact-items">
                <div className="contact-item">
                  <MapPin size={16} className="contact-icon" />
                  <span>{f.headquarters}</span>
                </div>
                <div className="contact-item">
                  <Globe size={16} className="contact-icon" />
                  <span>{f.sydneyOffice}</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} className="contact-icon" />
                  <span>contact@ketaglobal.com</span>
                </div>
                <div className="contact-item">
                  <Shield size={16} className="contact-icon" />
                  <span>{f.licensedEntity || "Licensed International Trade Promotion Entity"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="footer-bottom-bar">
            <div>
              &copy; {new Date().getFullYear()} KETA GLOBAL HOLDINGS. {f.rightsReserved} Powered by <a href="https://vkdigitalhub.com.au/" target="_blank">Vk Digital Hub</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
