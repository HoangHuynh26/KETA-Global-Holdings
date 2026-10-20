import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import FactoryAuditScorecard from './FactoryAuditScorecard';
import LogisticsRiskMatrix from './LogisticsRiskMatrix';
import { 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  ShieldCheck, 
  Award, 
  Ship, 
  Coffee, 
  TrendingUp, 
  Globe2 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { t } = useLanguage();
  const s = t.services;
  const sectionRef = useRef(null);

  // Active step states for interactive timeline / scorecard sync
  const [s5ActiveStep, setS5ActiveStep] = useState(0);
  const [s6ActiveStep, setS6ActiveStep] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate each chapter entrance smoothly as it scrolls into viewport
      const chapters = gsap.utils.toArray('.service-chapter');
      chapters.forEach((chapter) => {
        const isSticky = chapter.classList.contains('service-chapter-sticky');
        gsap.from(chapter, {
          scrollTrigger: {
            trigger: chapter,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: isSticky ? 0 : 35,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(chapter, { clearProps: 'transform' });
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Automatic step activation while scrolling through sticky chapters
  useEffect(() => {
    const s5Cards = document.querySelectorAll('[data-s5-step]');
    if (s5Cards.length === 0) return;

    const observer5 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-s5-step'), 10);
            if (!isNaN(idx)) setS5ActiveStep(idx);
          }
        });
      },
      {
        rootMargin: '-25% 0px -45% 0px',
        threshold: 0.1
      }
    );

    s5Cards.forEach((c) => observer5.observe(c));
    return () => observer5.disconnect();
  }, []);

  useEffect(() => {
    const s6Cards = document.querySelectorAll('[data-s6-step]');
    if (s6Cards.length === 0) return;

    const observer6 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-s6-step'), 10);
            if (!isNaN(idx)) setS6ActiveStep(idx);
          }
        });
      },
      {
        rootMargin: '-25% 0px -45% 0px',
        threshold: 0.1
      }
    );

    s6Cards.forEach((c) => observer6.observe(c));
    return () => observer6.disconnect();
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = document.getElementById('companyName');
        if (input) input.focus();
      }, 600);
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="services-section" ref={sectionRef} aria-label="Core Services">
      <div className="container">
        {/* Section Header */}
        <div className="services-intro">
          <h2 className="services-main-title">{s.sectionTitle}</h2>
          <p className="services-subtitle">{s.sectionSubtitle}</p>
        </div>

        {/* 8-Chapter Scrollytelling Story */}
        <div className="services-chapters-list">

          {/* Chapter 01: Global B2B Trade Promotion */}
          <article className="service-chapter" id="service-01">
            <div className="chapter-inner">
              <div className="chapter-content-col">
                <div className="chapter-meta">
                  <span className="chapter-number">01</span>
                </div>
                <h3 className="chapter-title">{s.s1.title}</h3>
                <div className="chapter-positioning">{s.s1.positioning}</div>
                <p className="chapter-description">{s.s1.description}</p>
                <ul className="chapter-bullets">
                  {s.s1.bullets.map((b, i) => (
                    <li key={i} className="bullet-item">
                      <CheckCircle2 size={16} className="bullet-icon" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="chapter-image-col">
                <div className="chapter-image-frame">
                  <img 
                    src="/assets/images/service-01-trade.png" 
                    alt={s.s1.title} 
                    className="chapter-img" 
                    loading="lazy" 
                  />
                  <div className="chapter-image-overlay" />
                </div>
              </div>
            </div>
          </article>

          {/* Chapter 02: Global Market Expo (GME) */}
          <article className="service-chapter layout-reverse" id="service-02">
            <div className="chapter-inner">
              <div className="chapter-image-col">
                <div className="chapter-image-frame">
                  <img 
                    src="/assets/images/service-02-gme.webp" 
                    alt={s.s2.title} 
                    className="chapter-img" 
                    loading="lazy" 
                  />
                  <div className="chapter-image-overlay" />
                </div>
              </div>

              <div className="chapter-content-col">
                <div className="chapter-meta">
                  <span className="chapter-number">02</span>
          
                </div>
                <h3 className="chapter-title">{s.s2.title}</h3>
                <div className="chapter-positioning">{s.s2.positioning}</div>
                <p className="chapter-description">{s.s2.description}</p>
                <ul className="chapter-bullets">
                  {s.s2.bullets.map((b, i) => (
                    <li key={i} className="bullet-item">
                      <CheckCircle2 size={16} className="bullet-icon" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          {/* Chapter 03: Cross-Border Business Matching */}
          <article className="service-chapter" id="service-03">
            <div className="chapter-inner">
              <div className="chapter-content-col">
                <div className="chapter-meta">
                  <span className="chapter-number">03</span>
          
                </div>
                <h3 className="chapter-title">{s.s3.title}</h3>
                <div className="chapter-positioning">{s.s3.positioning}</div>
                <p className="chapter-description">{s.s3.description}</p>
                <ul className="chapter-bullets">
                  {s.s3.bullets.map((b, i) => (
                    <li key={i} className="bullet-item">
                      <CheckCircle2 size={16} className="bullet-icon" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="chapter-image-col">
                <div className="chapter-image-frame chapter-video-frame">
                  <video 
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/assets/images/service-03-matching.jpg"
                    className="chapter-video"
                  >
                    <source src="/video_khong_watermark.mp4" type="video/mp4" />
                  </video>
                  <div className="chapter-image-overlay" />
                </div>
              </div>
            </div>
          </article>

          {/* Chapter 04: Global Export Compliance & Certification */}
          <article className="service-chapter layout-reverse" id="service-04">
            <div className="chapter-inner">
              <div className="chapter-image-col">
                <div className="chapter-image-frame">
                  <img 
                    src="/assets/images/service-04-compliance.jpg" 
                    alt={s.s4.title} 
                    className="chapter-img" 
                    loading="lazy" 
                  />
                  <div className="chapter-image-overlay" />
                </div>
              </div>

              <div className="chapter-content-col">
                <div className="chapter-meta">
                  <span className="chapter-number">04</span>
          
                </div>
                <h3 className="chapter-title">{s.s4.title}</h3>
                <div className="chapter-positioning">{s.s4.positioning}</div>
                <p className="chapter-description">{s.s4.description}</p>

                <div className="compliance-groups-grid">
                  {s.s4.groups.map((grp, i) => (
                    <div key={i} className="compliance-group-card">
                      <div className="compliance-group-title">{grp.category}</div>
                      <div className="compliance-group-certs">{grp.certs}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Chapter 05: Sourcing, Factory Auditing & QA (Layout: Content Left + Scorecard Table Right) */}
          <article className="service-chapter service-chapter-sticky" id="service-05">
            <div className="chapter-inner">
              <div className="chapter-content-col">
                <div className="chapter-meta">
                  <span className="chapter-number">05</span>
          
                </div>
                <h3 className="chapter-title">{s.s5.title}</h3>
                <div className="chapter-positioning">{s.s5.positioning}</div>
                <p className="chapter-description">{s.s5.description}</p>

                {/* Sourcing KPIs */}
                <div className="kpi-strip">
                  {s.s5.kpis.map((k, i) => (
                    <div key={i} className="kpi-card">
                      <div className="kpi-value">{k.value}</div>
                      <div className="kpi-label">{k.label}</div>
                    </div>
                  ))}
                </div>

                {/* 6-Step Sourcing Workflow Timeline */}
                <div className="workflow-steps-timeline" role="list">
                  {s.s5.steps.map((st, i) => (
                    <div
                      key={st.step}
                      data-s5-step={i}
                      className={`step-card ${s5ActiveStep === i ? 'active' : ''}`}
                      onClick={() => setS5ActiveStep(i)}
                      tabIndex={0}
                      role="listitem"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setS5ActiveStep(i);
                      }}
                    >
                      <div className="step-card-num">{st.step}</div>
                      <div className="step-card-content">
                        <div className="step-card-title">{st.title}</div>
                        <div className="step-card-desc">{st.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Right Column: Factory Audit Scorecard */}
              <div className="chapter-scorecard-col">
                <FactoryAuditScorecard activeStep={s5ActiveStep} />
              </div>
            </div>
          </article>

          {/* Chapter 06: Global Logistics & Supply Chain (Layout: Content Left + Risk Matrix Table Right) */}
          <article className="service-chapter service-chapter-sticky" id="service-06">
            <div className="chapter-inner">
              <div className="chapter-content-col">
                <div className="chapter-meta">
                  <span className="chapter-number">06</span>
          
                </div>
                <h3 className="chapter-title">{s.s6.title}</h3>
                <div className="chapter-positioning">{s.s6.positioning}</div>
                <p className="chapter-description">{s.s6.description}</p>

                {/* Logistics KPIs */}
                <div className="kpi-strip">
                  {s.s6.kpis.map((k, i) => (
                    <div key={i} className="kpi-card">
                      <div className="kpi-value">{k.value}</div>
                      <div className="kpi-label">{k.label}</div>
                    </div>
                  ))}
                </div>

                {/* 7-Step Logistics Workflow Timeline */}
                <div className="workflow-steps-timeline" role="list">
                  {s.s6.steps.map((st, i) => (
                    <div
                      key={st.step}
                      data-s6-step={i}
                      className={`step-card ${s6ActiveStep === i ? 'active' : ''}`}
                      onClick={() => setS6ActiveStep(i)}
                      tabIndex={0}
                      role="listitem"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setS6ActiveStep(i);
                      }}
                    >
                      <div className="step-card-num">{st.step}</div>
                      <div className="step-card-content">
                        <div className="step-card-title">{st.title}</div>
                        <div className="step-card-desc">{st.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Action Buttons */}
                <div className="chapter-actions">
                  <button 
                    type="button" 
                    className="gold-btn" 
                    onClick={scrollToContact}
                  >
                    <span>{t.hero.ctaConsult}</span>
                    <ArrowUpRight size={18} />
                  </button>

                  <button 
                    type="button" 
                    className="outline-btn" 
                    onClick={scrollToServices}
                  >
                    <span>{t.hero.ctaExplore}</span>
                  </button>
                </div>
              </div>

              {/* Table Column on Right: Risk Mitigation Matrix (Sticky Follow) */}
              <div className="chapter-scorecard-col">
                <LogisticsRiskMatrix activeStep={s6ActiveStep} />
              </div>
            </div>
          </article>

          {/* Chapter 07: Vietnam Global Marketplace Hub */}
          <article className="service-chapter" id="service-07">
            <div className="chapter-inner">
              <div className="chapter-content-col">
                <div className="chapter-meta">
                  <span className="chapter-number">07</span>
          
                </div>
                <h3 className="chapter-title">{s.s7.title}</h3>
                <div className="chapter-positioning">{s.s7.positioning}</div>
                <p className="chapter-description">{s.s7.description}</p>

                <div className="marketplace-cats-grid">
                  {s.s7.categories.map((cat, i) => (
                    <div key={i} className="market-cat-card">
                      <div className="market-cat-title">
                        <Coffee size={18} color="var(--color-gold-metallic)" />
                        <span>{cat.name}</span>
                      </div>
                      <p className="market-cat-items">{cat.items}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chapter-image-col">
                <div className="chapter-image-frame">
                  <img 
                    src="/assets/images/service-07-marketplace.jpg" 
                    alt={s.s7.title} 
                    className="chapter-img" 
                    loading="lazy" 
                  />
                  <div className="chapter-image-overlay" />
                </div>
              </div>
            </div>
          </article>

          {/* Chapter 08: Premium Export Strategy Consulting */}
          <article className="service-chapter layout-reverse" id="service-08">
            <div className="chapter-inner">
              <div className="chapter-image-col">
                <div className="chapter-image-frame">
                  <img 
                    src="/assets/images/service-08-consulting.jpg" 
                    alt={s.s8.title} 
                    className="chapter-img" 
                    loading="lazy" 
                  />
                  <div className="chapter-image-overlay" />
                </div>
              </div>

              <div className="chapter-content-col">
                <div className="chapter-meta">
                  <span className="chapter-number">08</span>
          
                </div>
                <h3 className="chapter-title">{s.s8.title}</h3>
                <div className="chapter-positioning">{s.s8.positioning}</div>
                <p className="chapter-description">{s.s8.description}</p>
                <ul className="chapter-bullets">
                  {s.s8.bullets.map((b, i) => (
                    <li key={i} className="bullet-item">
                      <CheckCircle2 size={16} className="bullet-icon" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="chapter-actions">
                  <button 
                    type="button" 
                    className="gold-btn" 
                    onClick={scrollToContact}
                  >
                    <span>{t.hero.ctaConsult}</span>
                    <ArrowUpRight size={18} />
                  </button>

                  <button 
                    type="button" 
                    className="outline-btn" 
                    onClick={scrollToServices}
                  >
                    <span>{t.hero.ctaExplore}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
