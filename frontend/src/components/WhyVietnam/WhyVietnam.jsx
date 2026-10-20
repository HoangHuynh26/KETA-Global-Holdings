import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Compass, Award, CheckCircle2 } from 'lucide-react';
import './WhyVietnam.css';

export default function WhyVietnam() {
  const { t } = useLanguage();
  const wv = t.whyVietnam;

  const getPillarIcon = (index) => {
    switch (index) {
      case 0:
        return <Compass size={22} />;
      case 1:
        return <Award size={22} />;
      default:
        return <Compass size={22} />;
    }
  };

  return (
    <section id="why-vietnam" className="why-vietnam-section" aria-label="Why Choose Vietnam">
      {/* Background Panorama */}
      <div className="why-vietnam-backdrop" aria-hidden="true">
        <img 
          src="/assets/images/why-vietnam.jpg" 
          alt="" 
          className="why-vietnam-bg-img" 
          loading="lazy" 
        />
        <div className="why-vietnam-overlay" />
      </div>

      <div className="container why-vietnam-content">
        <div className="why-vietnam-header">
          <h2 className="why-vietnam-title">{wv.headline}</h2>
        </div>

        {/* 2 Strategic Macro Pillars */}
        <div className="why-vietnam-grid" role="list">
          {wv.pillars.map((pillar, idx) => (
            <article key={pillar.num} className="macro-pillar-card" role="listitem">
              <div className="pillar-card-header">
                <span className="pillar-num">{pillar.num}</span>
                <div className="pillar-icon-wrap" aria-hidden="true">
                  {getPillarIcon(idx)}
                </div>
              </div>

              <h3 className="pillar-card-title">{pillar.title}</h3>

              <ul className="pillar-points-list">
                {pillar.points.map((pointText, pIdx) => (
                  <li key={pIdx} className="pillar-point-item">
                    <CheckCircle2 size={18} className="pillar-point-icon" aria-hidden="true" />
                    <span className="pillar-point-text">{pointText}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Strategic Affirmation Banner */}
        {wv.statement && (
          <div className="why-vietnam-statement-banner">
            <blockquote className="statement-text">
              “{wv.statement.split('.')[0]}.{' '}
              <span className="statement-gold">{wv.statement.split('.')[1] || ''}.</span>
              {wv.statement.split('.')[2] ? ` ${wv.statement.split('.')[2]}.` : ''}”
            </blockquote>
          </div>
        )}
      </div>
    </section>
  );
}
