import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FermentableDetail as FermentableDetailType } from '../../../../services/api';
import { getFermentableIcon } from '../../../../utils/typeIcons';

interface FermentableDetailProps {
  item: FermentableDetailType;
}

const FermentableDetail: React.FC<FermentableDetailProps> = ({ item }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="detail-row">
        <span className="label">{t('inventory.details.type')}</span>
        <span className="value">{getFermentableIcon(item.type)} {t(`inventory.details.types.${item.type}`)}</span>
      </div>
      {item.producer && (
        <div className="detail-row">
          <span className="label">{t('inventory.details.producer')}</span>
          <span className="value">{item.producer}</span>
        </div>
      )}
      {item.origin && (
        <div className="detail-row">
          <span className="label">{t('inventory.details.origin')}</span>
          <span className="value">{item.origin}</span>
        </div>
      )}
      <div className="detail-row">
        <span className="label">{t('inventory.details.color')}</span>
        <span className="value">{item.colorEbc} EBC</span>
      </div>
      <div className="detail-row">
        <span className="label">{t('inventory.details.yield')}</span>
        <span className="value">{item.yieldPercentage}%</span>
      </div>
      <div className="detail-row">
        <span className="label">{t('inventory.details.protein')}</span>
        <span className="value">{item.protein}%</span>
      </div>
      {item.moisture > 0 && (
        <div className="detail-row">
          <span className="label">{t('inventory.details.moisture')}</span>
          <span className="value">{item.moisture}%</span>
        </div>
      )}
      {item.diastaticPower > 0 && (
        <div className="detail-row">
          <span className="label">{t('inventory.details.diastatic_power')}</span>
          <span className="value">{item.diastaticPower} °Lintner</span>
        </div>
      )}
      {item.fan > 0 && (
        <div className="detail-row">
          <span className="label">FAN</span>
          <span className="value">{item.fan} mg/L</span>
        </div>
      )}
      {item.betaGlucan > 0 && (
        <div className="detail-row">
          <span className="label">Beta Glucan</span>
          <span className="value">{item.betaGlucan} mg/L</span>
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

export default FermentableDetail;
