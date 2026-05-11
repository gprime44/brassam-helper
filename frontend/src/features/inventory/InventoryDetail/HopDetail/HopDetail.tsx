import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Hop } from '../../../../services/api';

interface HopDetailProps {
  item: Hop;
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
        <span className="label">{t('inventory.details.origin')}</span>
        <span className="value">{item.origin}</span>
      </div>
    </>
  );
};

export default HopDetail;
