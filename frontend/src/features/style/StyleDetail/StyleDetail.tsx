import React from 'react';
import type { StyleDetail as StyleDetailType } from '../../../services/api';
import StyleRangeBar from './StyleRangeBar';

interface StyleDetailProps {
  item: StyleDetailType;
}

const StyleDetail: React.FC<StyleDetailProps> = ({ item }) => {
  return (
    <div className="style-detail-view">
      <div className="recipe-stats-gauges" style={{ marginBottom: '32px' }}>
        <StyleRangeBar label="OG" min={item.ogMin} max={item.ogMax} decimals={3} />
        <StyleRangeBar label="FG" min={item.fgMin} max={item.fgMax} decimals={3} />
        <StyleRangeBar label="IBU" min={item.ibuMin} max={item.ibuMax} decimals={0} />
        <StyleRangeBar label="EBC" min={item.ebcMin} max={item.ebcMax} decimals={0} />
        <StyleRangeBar label="ABV" min={item.abvMin} max={item.abvMax} decimals={1} unit="%" />
      </div>

      <div className="sensory-sections">
        {item.aroma && (
          <section className="sensory-item">
            <h4>👃 Aroma</h4>
            <p>{item.aroma}</p>
          </section>
        )}
        {item.appearance && (
          <section className="sensory-item">
            <h4>👁️ Appearance</h4>
            <p>{item.appearance}</p>
          </section>
        )}
        {item.flavor && (
          <section className="sensory-item">
            <h4>👅 Flavor</h4>
            <p>{item.flavor}</p>
          </section>
        )}
        {item.mouthfeel && (
          <section className="sensory-item">
            <h4>🥤 Mouthfeel</h4>
            <p>{item.mouthfeel}</p>
          </section>
        )}
      </div>

      {item.notes && (
        <div className="detail-section-notes">
          <h4 className="notes-title">History & Notes</h4>
          <p className="notes-content">{item.notes}</p>
        </div>
      )}
    </div>
  );
};

export default StyleDetail;
