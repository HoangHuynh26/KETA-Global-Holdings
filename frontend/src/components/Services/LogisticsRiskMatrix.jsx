import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LogisticsRiskMatrix({ activeStep = 0 }) {
  const { t } = useLanguage();
  const s6 = t.services.s6;
  const [selectedRow, setSelectedRow] = useState(null);

  // Map step to risk row
  const highlightedIndex = selectedRow !== null ? selectedRow : (activeStep % 4);

  return (
    <div className="risk-matrix-wrapper" role="region" aria-label={s6.matrixTitle}>
      <div className="scorecard-header">
        <div className="scorecard-header-icon">
          <ShieldCheck size={20} color="var(--color-gold-metallic)" />
        </div>
        <div>
          <h4 className="scorecard-header-title">{s6.matrixTitle}</h4>
          <span className="scorecard-header-subtitle">Active Risk Containment Protocols for Global Maritime Shipping</span>
        </div>
      </div>

      <div className="scorecard-table-scroll">
        <table className="scorecard-table risk-table">
          <thead>
            <tr>
              <th scope="col">{s6.matrixCols[0]}</th>
              <th scope="col">{s6.matrixCols[1]}</th>
              <th scope="col">{s6.matrixCols[2]}</th>
            </tr>
          </thead>
          <tbody>
            {s6.matrixRows.map((row, idx) => {
              const isHighlight = idx === highlightedIndex;
              return (
                <tr
                  key={row.risk}
                  className={`scorecard-row risk-row ${isHighlight ? 'active-row' : ''}`}
                  onClick={() => setSelectedRow(idx)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedRow(idx);
                    }
                  }}
                  aria-selected={isHighlight}
                >
                  <td className="row-risk">
                    <div className="risk-indicator">
                      <AlertTriangle size={14} color="var(--color-warning)" />
                    </div>
                    <strong>{row.risk}</strong>
                  </td>
                  <td className="row-cause">{row.cause}</td>
                  <td className="row-solution">
                    <div className="solution-box">
                      <ArrowRight size={14} color="var(--color-gold-metallic)" />
                      <span>{row.sol}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="scorecard-footer">
        <div className="scorecard-footer-item">
          <span>OTIF Target: &gt; 98%</span>
        </div>
        <div className="scorecard-footer-item">
          <span>Clause A Cargo Insurance: 110% CIF</span>
        </div>
      </div>
    </div>
  );
}
