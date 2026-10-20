import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Quote } from 'lucide-react';
import './Founder.css';

export default function Founder() {
  const { t } = useLanguage();
  const f = t.founder;

  return (
    <section id="founder" className="founder-section" aria-label="Founder's Message">
      <div className="container">
        {/* Section Header */}
        <div className="founder-intro">
          <h2 className="founder-section-title">{f.headline}</h2>
        </div>

        {/* Editorial Letter Grid */}
        <div className="founder-letter-grid">
          {/* Portrait Column */}
          <div className="founder-portrait-col">
            <div className="founder-portrait-card">
              <img 
                src="/assets/images/founder-portrait.jpg" 
                alt={`${f.name} - ${f.title}`} 
                className="founder-img" 
                loading="lazy" 
              />
              <div className="founder-caption">
                <div className="founder-name">{f.name}</div>
                <div className="founder-role">{f.title}</div>
              </div>
            </div>
          </div>

          {/* Letter Content Column */}
          <div className="founder-letter-col">
            {/* Opening Quote */}
            <div className="letter-quote-block">
              <p className="letter-quote-text">{f.quote}</p>
            </div>

            {/* Salutation */}
            <h3 className="letter-salutation">{f.letterSalutation}</h3>

            {/* Letter Body */}
            <div className="letter-paragraphs">
              <p className="letter-p">{f.letterP1}</p>
              <p className="letter-p">{f.letterP2}</p>
              <p className="letter-p">{f.letterP3}</p>
              <p className="letter-p">{f.letterP4}</p>
            </div>

            {/* Commitments Box */}
            <div className="letter-commitments-box">
              <div className="commitment-item">
                <span className="commitment-title">{f.commitmentFactoryTitle}</span>
                <p className="commitment-desc">{f.commitmentFactory}</p>
              </div>
              <div className="commitment-item">
                <span className="commitment-title">{f.commitmentBuyerTitle}</span>
                <p className="commitment-desc">{f.commitmentBuyer}</p>
              </div>
            </div>

            <p className="letter-p" style={{ marginBottom: 'var(--space-8)' }}>
              {f.letterClose}
            </p>

            {/* Signoff */}
            <div className="letter-signoff">
              <div className="signoff-word">{f.signoff}</div>
              <div className="signature-block">
                <div className="signature-name">{f.name}</div>
                <div className="signature-title">{f.title}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
