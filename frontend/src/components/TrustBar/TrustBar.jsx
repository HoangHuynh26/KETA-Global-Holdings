import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './TrustBar.css';

export default function TrustBar() {
  const { t } = useLanguage();

  return (
    <section id="trust-metrics" className="trustbar-section" aria-label="Trust Metrics and Institutional Scale">
      <div className="container">

        <div className="trustbar-grid" role="region" aria-label="Institutional Metric Cards">
          {t.trustMetrics.items.map((item) => (
            <div
              key={item.id}
              className="metric-card"
              role="group"
              aria-label={`${item.label}: ${item.metric}`}
            >
              <div className="metric-value">{item.metric}</div>
              <div className="metric-label">{item.label}</div>
              <div className="metric-meaning">
                {item.strategicMeaning}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
