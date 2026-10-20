import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import './Hero.css';

export default function Hero() {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const leadRef = useRef(null);
  const actionsRef = useRef(null);
  const flankLeftRef = useRef(null);
  const flankRightRef = useRef(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (flankLeftRef.current) {
        tl.from(flankLeftRef.current, {
          x: -50,
          opacity: 0,
          duration: 1.2
        }, 0.2);
      }

      if (flankRightRef.current) {
        tl.from(flankRightRef.current, {
          x: 50,
          opacity: 0,
          duration: 1.2
        }, 0.2);
      }

      if (titleRef.current?.children?.length) {
        tl.from(titleRef.current.children, {
          y: 35,
          opacity: 0,
          duration: 1,
          stagger: 0.15
        }, 0.4);
      }

      const tagline = heroRef.current?.querySelector('.hero-tagline');
      if (tagline) {
        tl.from(tagline, {
          scale: 0.95,
          opacity: 0,
          duration: 0.8
        }, 0.7);
      }

      if (leadRef.current) {
        tl.from(leadRef.current, {
          y: 25,
          opacity: 0,
          duration: 0.9
        }, 0.9);
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section" ref={heroRef} aria-label="Hero Introduction">
      {/* Background Seaport Atmosphere */}
      <div className="hero-bg-media" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/images/service-06-logistics.jpg"
          className="hero-bg-video"
        >
          <source src="/gemini_generated_video_a1297807.mp4" type="video/mp4" />
        </video>
        <div className="hero-bg-gradient-overlay" />
      </div>

      {/* Stepped Staircase Geometric Flank — Left Side */}
      <div className="hero-staircase-flank hero-staircase-left" ref={flankLeftRef} aria-hidden="true">
        <svg viewBox="0 0 260 800" preserveAspectRatio="none" className="staircase-svg">
          <defs>
            <linearGradient id="staircaseGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#050E1A" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#0A192F" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#002B5B" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="staircaseGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EED68B" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#997A24" />
            </linearGradient>
          </defs>
          {/* Stepped Cascade Polygons */}
          <path
            d="M 0,0 
               L 260,0 
               L 260,110 
               L 215,110 
               L 215,230 
               L 170,230 
               L 170,360 
               L 125,360 
               L 125,500 
               L 80,500 
               L 80,650 
               L 35,650 
               L 35,800 
               L 0,800 Z"
            fill="url(#staircaseGradLeft)"
          />
          {/* Stepped Edge Gold Highlight Line */}
          <path
            d="M 260,0 
               L 260,110 
               L 215,110 
               L 215,230 
               L 170,230 
               L 170,360 
               L 125,360 
               L 125,500 
               L 80,500 
               L 80,650 
               L 35,650 
               L 35,800"
            fill="none"
            stroke="url(#staircaseGoldBorder)"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Secondary Architectural Accent Line */}
          <path
            d="M 250,0 
               L 250,100 
               L 205,100 
               L 205,220 
               L 160,220 
               L 160,350 
               L 115,350 
               L 115,490 
               L 70,490 
               L 70,640 
               L 25,640 
               L 25,800"
            fill="none"
            stroke="rgba(212, 175, 55, 0.25)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        </svg>
      </div>

      {/* Stepped Staircase Geometric Flank — Right Side (Symmetrical Mirror) */}
      <div className="hero-staircase-flank hero-staircase-right" ref={flankRightRef} aria-hidden="true">
        <svg viewBox="0 0 260 800" preserveAspectRatio="none" className="staircase-svg">
          <path
            d="M 0,0 
               L 260,0 
               L 260,110 
               L 215,110 
               L 215,230 
               L 170,230 
               L 170,360 
               L 125,360 
               L 125,500 
               L 80,500 
               L 80,650 
               L 35,650 
               L 35,800 
               L 0,800 Z"
            fill="url(#staircaseGradLeft)"
          />
          <path
            d="M 260,0 
               L 260,110 
               L 215,110 
               L 215,230 
               L 170,230 
               L 170,360 
               L 125,360 
               L 125,500 
               L 80,500 
               L 80,650 
               L 35,650 
               L 35,800"
            fill="none"
            stroke="url(#staircaseGoldBorder)"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </div>

      {/* Central Majestic Content Stage */}
      <div className="container hero-stage">
        <h1 className="hero-title" ref={titleRef}>
          <span className="hero-title-line-1">{t.hero.headlinePart1}</span>
          <span className="hero-title-line-2">{t.hero.headlinePart2}</span>
        </h1>

        <div className="hero-tagline">
          <span>{t.hero.tagline}</span>
        </div>

        <p className="hero-lead-text" ref={leadRef}>
          {t.hero.lead}
        </p>

        <div className="hero-actions" ref={actionsRef}>
          <button
            type="button"
            className="gold-btn hero-cta-primary"
            onClick={() => scrollTo('services')}
          >
            <span>{t.hero.ctaExplore}</span>
            <ArrowUpRight size={18} />
          </button>

          <button
            type="button"
            className="outline-btn hero-cta-secondary"
            onClick={() => {
              scrollTo('contact');
              setTimeout(() => {
                const el = document.getElementById('companyName');
                if (el) el.focus();
              }, 500);
            }}
          >
            <span>{t.hero.ctaConsult}</span>
          </button>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <button
        type="button"
        className="hero-scroll-indicator"
        onClick={() => scrollTo('trust-metrics')}
        aria-label="Scroll to institutional metrics"
      >
        <span className="hero-scroll-text">{t.hero.scrollHint || 'Explore'}</span>
        <ChevronDown size={18} className="hero-scroll-chevron" />
      </button>
    </section>
  );
}
