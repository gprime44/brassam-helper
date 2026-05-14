import React from 'react';
import '../../../components/RangeGauge/RangeGauge.css';

interface StyleRangeBarProps {
  label: string;
  min: number;
  max: number;
  decimals?: number;
  unit?: string;
}

const StyleRangeBar: React.FC<StyleRangeBarProps> = ({ label, min, max, decimals = 1, unit = '' }) => {
  // We use same proportions as RangeGauge for visual consistency
  const displayMin = min * 0.8;
  const displayMax = max * 1.2;
  const range = displayMax - displayMin;
  
  const targetMinPos = ((min - displayMin) / range) * 100;
  const targetMaxPos = ((max - displayMin) / range) * 100;
  const targetWidth = targetMaxPos - targetMinPos;

  return (
    <div className="range-gauge-row">
      <div className="gauge-abbr">{label}</div>
      <div className="gauge-track-wrapper">
        <div className="gauge-track-large" style={{ background: 'var(--border)', opacity: 0.5 }}>
          {/* Zone cible (Min/Max) */}
          <div 
            className="gauge-target-zone" 
            style={{ left: `${targetMinPos}%`, width: `${targetWidth}%`, opacity: 1 }}
          >
            <span className="limit-label min">{min.toFixed(decimals)}{unit}</span>
            <span className="limit-label max">{max.toFixed(decimals)}{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleRangeBar;
