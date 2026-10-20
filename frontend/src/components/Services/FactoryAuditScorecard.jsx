import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ClipboardCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function FactoryAuditScorecard({ activeStep = 0 }) {
  const { t } = useLanguage();
  const s5 = t.services.s5;
  const [selectedRow, setSelectedRow] = useState(null);

  // Map step 0..5 to row 0..5
  const highlightedIndex = selectedRow !== null ? selectedRow : activeStep % 6;

  return (
    <div className="audit-scorecard-wrapper" role="region" aria-label={s5.scorecardTitle}>
      <div className="scorecard-header">
        <div className="scorecard-header-icon">
          <ClipboardCheck size={20} color="var(--color-gold-metallic)" />
        </div>
        <div>
          <h4 className="scorecard-header-title">{s5.scorecardTitle}</h4>
          <span className="scorecard-header-subtitle">Standardized 100-Point Factory Verification Benchmark</span>
        </div>
      </div>

      <div className="scorecard-table-scroll">
        <table className="scorecard-table">
          <thead>
            <tr>
              <th scope="col">{s5.scorecardCols[0]}</th>
              <th scope="col">{s5.scorecardCols[1]}</th>
              <th scope="col">{s5.scorecardCols[2]}</th>
            </tr>
          </thead>
          <tbody>
            {s5.scorecardRows.map((row, idx) => {
              const isHighlight = idx === highlightedIndex;
              return (
                <tr
                  key={row.cat}
                  className={`scorecard-row ${isHighlight ? 'active-row' : ''}`}
                  onClick={() => setSelectedRow(idx)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedRow(idx);
                    }
                  }}
                  aria-selected={isHighlight}
                >
                  <td className="row-category">
                    <div className="cat-bullet" />
                    <strong>{row.cat}</strong>
                  </td>
                  <td className="row-focus">{row.focus}</td>
                  <td className="row-standard">
                    <span className="weight-badge">{row.weight}</span>
                    <span className="standard-text">{row.standard}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="scorecard-footer">
        <div className="scorecard-footer-item">
          <CheckCircle2 size={16} color="var(--color-gold-metallic)" />
          <span>Zero Tolerance for Critical Contamination</span>
        </div>
        <div className="scorecard-footer-item">
          <ShieldAlert size={16} color="var(--color-gold-light)" />
          <span>ISO / BRCGS / FDA Alignment Guaranteed</span>
        </div>
      </div>
    </div>
  );
}
