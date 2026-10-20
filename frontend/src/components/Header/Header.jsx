import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Menu, X, ChevronRight, Globe, ChevronDown, Check } from 'lucide-react';
import './Header.css';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', short: 'EN', nativeName: 'English', flag: '🇬🇧' },
  { code: 'vi', label: 'Tiếng Việt', short: 'VI', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', label: '简体中文', short: '中文', nativeName: '简体中文', flag: '🇨🇳' }
];

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'services', 'why-vietnam', 'b2b-showcase', 'founder', 'contact'];
      const scrollPos = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [langDropdownOpen]);

  // Handle escape key to close mobile menu or dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (langDropdownOpen) setLangDropdownOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, langDropdownOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (targetId === 'contact') {
        setTimeout(() => {
          const input = document.getElementById('companyName');
          if (input) input.focus();
        }, 500);
      }
    }
  };

  const drawerModal = typeof document !== 'undefined' ? (
    <div 
      className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`}
      onClick={() => setMobileMenuOpen(false)}
      aria-hidden={!mobileMenuOpen}
    >
      <div 
        className="mobile-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-drawer-header">
          <img 
            src="/assets/logo/keta-logo.png" 
            alt="KETA GLOBAL" 
            className="mobile-drawer-logo"
          />
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label={t.nav.close}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <a
            href="#home"
            className={`mobile-nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'home')}
          >
            <span>{t.nav.home}</span>
            <ChevronRight size={18} color="var(--color-gold-metallic)" />
          </a>
          <a
            href="#services"
            className={`mobile-nav-link ${activeSection === 'services' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'services')}
          >
            <span>{t.nav.services}</span>
            <ChevronRight size={18} color="var(--color-gold-metallic)" />
          </a>
          <a
            href="#why-vietnam"
            className={`mobile-nav-link ${activeSection === 'why-vietnam' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'why-vietnam')}
          >
            <span>{t.nav.whyVietnam}</span>
            <ChevronRight size={18} color="var(--color-gold-metallic)" />
          </a>
          <a
            href="#b2b-showcase"
            className={`mobile-nav-link ${activeSection === 'b2b-showcase' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'b2b-showcase')}
          >
            <span>{t.nav.b2bShowcase || 'Showcase'}</span>
            <ChevronRight size={18} color="var(--color-gold-metallic)" />
          </a>
          <a
            href="#founder"
            className={`mobile-nav-link ${activeSection === 'founder' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'founder')}
          >
            <span>{t.nav.founder}</span>
            <ChevronRight size={18} color="var(--color-gold-metallic)" />
          </a>
          <a
            href="#contact"
            className={`mobile-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            <span>{t.nav.contact}</span>
            <ChevronRight size={18} color="var(--color-gold-metallic)" />
          </a>
        </nav>

        <div className="mobile-drawer-footer">
          {/* Mobile 3-Language Segmented Tabs */}
          <div className="mobile-drawer-lang-tabs" role="group" aria-label="Select Language">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                className={`mobile-lang-tab ${lang === option.code ? 'active' : ''}`}
                onClick={() => setLang(option.code)}
                aria-pressed={lang === option.code}
              >
                <span className="tab-flag" aria-hidden="true">{option.flag}</span>
                <span className="tab-name">{option.nativeName}</span>
              </button>
            ))}
          </div>
          <a
            href="#contact"
            className="gold-btn mobile-drawer-cta"
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            <span>{t.nav.cta}</span>
          </a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          {/* Brand Logo */}
          <a 
            href="#home" 
            className="brand-link" 
            onClick={(e) => scrollToSection(e, 'home')}
            aria-label="KETA Global Holdings Home"
          >
            <img 
              src="/assets/logo/keta-logo.png" 
              alt="KETA GLOBAL" 
              className="brand-logo-img" 
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <a
              href="#home"
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'home')}
            >
              {t.nav.home}
            </a>
            <a
              href="#services"
              className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'services')}
            >
              {t.nav.services}
            </a>
            <a
              href="#why-vietnam"
              className={`nav-link ${activeSection === 'why-vietnam' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'why-vietnam')}
            >
              {t.nav.whyVietnam}
            </a>
            <a
              href="#b2b-showcase"
              className={`nav-link ${activeSection === 'b2b-showcase' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'b2b-showcase')}
            >
              {t.nav.b2bShowcase || 'Showcase'}
            </a>
            <a
              href="#founder"
              className={`nav-link ${activeSection === 'founder' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'founder')}
            >
              {t.nav.founder}
            </a>
            <a
              href="#contact"
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'contact')}
            >
              {t.nav.contact}
            </a>
          </nav>

          {/* Right Actions */}
          <div className="header-actions">
            {/* Desktop Language Dropdown */}
            <div className="lang-dropdown-wrapper" ref={langDropdownRef}>
              <button
                type="button"
                className={`lang-dropdown-trigger ${langDropdownOpen ? 'active' : ''}`}
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                aria-expanded={langDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select Language"
              >
                <Globe size={15} className="lang-globe-icon" />
                <span className="lang-current-label">
                  {LANGUAGE_OPTIONS.find((opt) => opt.code === lang)?.short || 'EN'}
                </span>
                <ChevronDown size={13} className={`lang-chevron-icon ${langDropdownOpen ? 'open' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="lang-dropdown-menu" role="listbox">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      className={`lang-dropdown-item ${lang === option.code ? 'selected' : ''}`}
                      onClick={() => {
                        setLang(option.code);
                        setLangDropdownOpen(false);
                      }}
                      role="option"
                      aria-selected={lang === option.code}
                    >
                      <span className="lang-item-flag" aria-hidden="true">{option.flag}</span>
                      <span className="lang-item-label">{option.nativeName}</span>
                      <span className="lang-item-badge">{option.short}</span>
                      {lang === option.code && (
                        <Check size={14} className="lang-check-icon" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop CTA */}
            <a
              href="#contact"
              className="gold-btn header-cta-btn"
              onClick={(e) => scrollToSection(e, 'contact')}
            >
              <span>{t.nav.cta}</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={t.nav.menu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Render mobile drawer via React Portal to document.body to avoid backdrop-filter traps */}
      {drawerModal && createPortal(drawerModal, document.body)}
    </>
  );
}
