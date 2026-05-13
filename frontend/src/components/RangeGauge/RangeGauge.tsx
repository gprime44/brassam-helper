import React from 'react';
import './RangeGauge.css';

interface RangeGaugeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  decimals?: number;
}

const RangeGauge: React.FC<RangeGaugeProps> = ({ label, value, min, max, unit = '', decimals = 1 }) => {
  const displayMin = min * 0.8;
  const displayMax = max * 1.2;
  const range = displayMax - displayMin;
  
  const valuePos = Math.min(Math.max(((value - displayMin) / range) * 100, 0), 100);
  const targetMinPos = ((min - displayMin) / range) * 100;
  const targetMaxPos = ((max - displayMin) / range) * 100;
  const targetWidth = targetMaxPos - targetMinPos;

  return (
    <div className="range-gauge-row">
      <div className="gauge-abbr">{label}</div>
      <div className="gauge-track-wrapper">
        <div className="gauge-track-large">
          {/* Zone cible (Min/Max) */}
          <div 
            className="gauge-target-zone" 
            style={{ left: `${targetMinPos}%`, width: `${targetWidth}%` }}
          >
            <span className="limit-label min">{min.toFixed(decimals)}</span>
            <span className="limit-label max">{max.toFixed(decimals)}</span>
          </div>

          {/* Curseur de la valeur actuelle */}
          <div 
            className="gauge-value-marker" 
            style={{ left: `${valuePos}%` }}
          >
            <div className="marker-line-full"></div>
            <span className="current-value-label">
              {value.toFixed(decimals)}{unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeGauge;
