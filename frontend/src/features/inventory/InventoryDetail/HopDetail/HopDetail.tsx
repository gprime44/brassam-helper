import React from 'react';
import { useTranslation } from 'react-i18next';
import type { HopDetail as HopDetailType } from '../../../../services/api';

interface HopDetailProps {
  item: HopDetailType;
}

const HopDetail: React.FC<HopDetailProps> = ({ item }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="detail-row">
        <span className="label">{t('inventory.details.alpha_acid')}</span>
        <span className="value">{item.alphaAcid}%</span>
      </div>
      <div className="detail-row">
        <span className="label">{t('inventory.details.beta_acid')}</span>
        <span className="value">{item.betaAcid}%</span>
      </div>
      <div className="detail-row">
        <span className="label">{t('inventory.details.origin')}</span>
        <span className="value">{item.origin}</span>
      </div>
      {item.substitutes && (
        <div className="detail-row">
          <span className="label">{t('inventory.details.substitutes')}</span>
          <span className="value">{item.substitutes}</span>
        </div>
      )}
      {item.totalOil > 0 && (
        <div className="detail-section-oils" style={{ marginTop: '16px', padding: '12px', background: 'var(--accent-bg)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--accent)' }}>Huiles essentielles ({item.totalOil} ml/100g)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <div>Myrcène: {item.myrcene}%</div>
            <div>Humulène: {item.humulene}%</div>
            <div>Cohumulone: {item.cohumulone}%</div>
            <div>Caryophyllène: {item.caryophyllene}%</div>
            <div>Farnésène: {item.farnesene}%</div>
          </div>
        </div>
      )}
      {item.notes && (
        <div className="detail-section-notes">
          <h4 className="notes-title">{t('inventory.details.notes')}</h4>
          <p className="notes-content">{item.notes}</p>
        </div>
      )}
    </>
  );
};

export default HopDetail;
