import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  Globe2, 
  Package, 
  Award, 
  Factory 
} from 'lucide-react';
import { getLocalShowcaseItems, fetchRemoteShowcaseItems } from '../../services/showcaseService';
import './B2BShowcase.css';

export default function B2BShowcase() {
  const { lang, t } = useLanguage();
  const b2b = t.b2bShowcase || {};
  const defaultItems = b2b.items || [];

  const [items, setItems] = useState(() => getLocalShowcaseItems(lang, defaultItems));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Sync items when lang changes or remote data loads
  useEffect(() => {
    const local = getLocalShowcaseItems(lang, defaultItems);
    setItems(local);
    setActiveIndex(0);

    fetchRemoteShowcaseItems(lang, defaultItems).then(remote => {
      if (remote && remote.length > 0) {
        setItems(remote);
      }
    });
  }, [lang, b2b.items]);

  // Listen to custom event when admin edits/resets products
  useEffect(() => {
    const handleShowcaseUpdate = (e) => {
      if (!e.detail || !e.detail.lang || e.detail.lang === lang) {
        const newItems = (e.detail?.items && Array.isArray(e.detail.items))
          ? e.detail.items
          : getLocalShowcaseItems(lang, defaultItems);
        setItems(newItems);
        setActiveIndex(prev => (prev >= newItems.length ? Math.max(0, newItems.length - 1) : prev));
      }
    };

    window.addEventListener('keta:showcase-updated', handleShowcaseUpdate);
    return () => window.removeEventListener('keta:showcase-updated', handleShowcaseUpdate);
  }, [lang, defaultItems]);

  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const autoplayTimerRef = useRef(null);
  const sectionRef = useRef(null);

  const totalItems = items.length;

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + totalItems) % totalItems);
  };

  const handleSelectCard = (idx) => {
    setActiveIndex(idx);
  };

  // Handle Autoplay
  useEffect(() => {
    if (!isPlaying || totalItems === 0) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % totalItems);
    }, 4500);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPlaying, totalItems, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isInViewport) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + totalItems) % totalItems);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalItems]);

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndXRef.current = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  // Handle RFQ Click -> dispatch event to pre-populate BusinessForm and smooth scroll
  const handleRequestQuote = (item) => {
    window.dispatchEvent(new CustomEvent('keta:select-product', {
      detail: {
        product: `${item.title} (${item.category})`,
        service: '07'
      }
    }));
  };

  if (!items || items.length === 0) return null;

  const currentItem = items[activeIndex] || items[0];

  return (
    <section 
      id="b2b-showcase" 
      className="b2b-showcase-section" 
      ref={sectionRef}
      aria-label="B2B Marketplace Showcase"
    >
      {/* Background Ambience */}
      <div className="b2b-showcase-backdrop" aria-hidden="true">
        <div className="b2b-backdrop-radial" />
        <div className="b2b-backdrop-grid" />
        <div className="b2b-light-glow top-left" />
        <div className="b2b-light-glow bottom-right" />
      </div>

      <div className="container b2b-showcase-container">
        {/* Header Header & Tagline */}
        <div className="b2b-showcase-header">
          <h2 className="b2b-showcase-headline">{b2b.headline}</h2>
        </div>

        {/* MAIN STACKED CAROUSEL STAGE */}
        <div 
          className="b2b-carousel-stage spotlight"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* 3D Perspective Card Deck */}
          <div className="stacked-carousel-container" aria-live="polite">
            <div className="stacked-carousel-3d-scene">
              {items.map((item, idx) => {
                const isCurrent = idx === activeIndex;

                let cardClass = 'stack-card';
                if (isCurrent) cardClass += ' is-active';

                return (
                  <div
                    key={item.id || idx}
                    className={cardClass}
                    onClick={() => handleSelectCard(idx)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.title} - ${item.category}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectCard(idx);
                      }
                    }}
                  >
                    <div className="card-media-wrapper">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="card-media-img"
                        loading={idx <= 2 ? 'eager' : 'lazy'}
                        onError={(e) => {
                          const src = e.currentTarget.src;
                          if (src.endsWith('.jpg')) {
                            e.currentTarget.src = src.replace('.jpg', '.jpeg');
                          } else if (src.endsWith('.jpeg')) {
                            e.currentTarget.src = src.replace('.jpeg', '.jpg');
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="b2b-carousel-nav-arrows">
            <button
              type="button"
              className="carousel-arrow-btn prev-btn"
              onClick={handlePrev}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="carousel-arrow-btn next-btn"
              onClick={handleNext}
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Autoplay Progress Line Indicator */}
          <div className="b2b-carousel-indicators" role="tablist">
            {items.map((item, idx) => (
              <button
                key={item.id || idx}
                type="button"
                className={`carousel-dot ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => handleSelectCard(idx)}
                aria-label={`Go to slide ${idx + 1}: ${item.title}`}
                role="tab"
                aria-selected={activeIndex === idx}
              >
                <span className="dot-fill" />
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE PRODUCT STRATEGIC DETAIL SPOTLIGHT */}
        <div className="b2b-spotlight-details-panel">
          <div className="spotlight-card-content">
            {/* Left Strategic Badges & Title */}
            <div className="spotlight-header-col">
              <div className="spotlight-badge-row">
                <span className="verified-badge">
                  <ShieldCheck size={16} />
                  <span>{b2b.badgeVerified || 'Verified ISO/FDA Standard'}</span>
                </span>
                <span className="category-label">{currentItem.category}</span>
              </div>

              <h3 className="spotlight-title">{currentItem.title}</h3>
              <p className="spotlight-subtitle">{currentItem.subtitle}</p>
              <p className="spotlight-description">{currentItem.description}</p>

              {/* Core Quality Highlights */}
              {currentItem.highlights && (
                <div className="spotlight-highlights-list">
                  {currentItem.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="highlight-item">
                      <CheckCircle2 size={16} className="highlight-icon" />
                      <span className="highlight-text">{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Strategic Specifications Grid */}
            <div className="spotlight-specs-col">
              <div className="specs-card-grid">
                <div className="spec-box">
                  <div className="spec-header">
                    <Award size={16} className="spec-icon" />
                    <span className="spec-label">{b2b.cardActions?.standards || 'Compliance'}</span>
                  </div>
                  <span className="spec-value">{currentItem.standards}</span>
                </div>

                <div className="spec-box">
                  <div className="spec-header">
                    <Factory size={16} className="spec-icon" />
                    <span className="spec-label">{b2b.cardActions?.capacity || 'Capacity'}</span>
                  </div>
                  <span className="spec-value highlight-gold">{currentItem.capacity}</span>
                </div>

                <div className="spec-box">
                  <div className="spec-header">
                    <Globe2 size={16} className="spec-icon" />
                    <span className="spec-label">{b2b.cardActions?.markets || 'Key Markets'}</span>
                  </div>
                  <span className="spec-value">{currentItem.markets}</span>
                </div>

                <div className="spec-box">
                  <div className="spec-header">
                    <Package size={16} className="spec-icon" />
                    <span className="spec-label">{b2b.cardActions?.packaging || 'Packaging'}</span>
                  </div>
                  <span className="spec-value">{currentItem.packaging}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="spotlight-actions-row">
                <button
                  type="button"
                  className="btn-rfq-action"
                  onClick={() => handleRequestQuote(currentItem)}
                >
                  <span>{b2b.cardActions?.rfq || 'Yêu Cầu Báo Giá RFQ'}</span>
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
