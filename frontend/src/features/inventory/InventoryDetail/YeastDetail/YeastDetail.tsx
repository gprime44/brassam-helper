import React from 'react';
import { useTranslation } from 'react-i18next';
import type { YeastDetail as YeastDetailType } from '../../../../services/api';
import { getYeastIcon } from '../../../../utils/typeIcons';

interface YeastDetailProps {
  item: YeastDetailType;
}

const YeastDetail: React.FC<YeastDetailProps> = ({ item }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="detail-row">
        <span className="label">{t('inventory.details.type')}</span>
        <span className="value">{getYeastIcon(item.type)} {t(`inventory.details.types.${item.type}`)}</span>
      </div>
      {item.producer && (
        <div className="detail-row">
          <span className="label">{t('inventory.details.producer')}</span>
          <span className="value">{item.producer} {item.productId && `(${item.productId})`}</span>
        </div>
      )}
      <div className="detail-row">
        <span className="label">{t('inventory.details.attenuation')}</span>
        <span className="value">{item.attenuationMin}% - {item.attenuationMax}%</span>
      </div>
      <div className="detail-row">
        <span className="label">{t('inventory.details.alcohol_tolerance')}</span>
        <span className="value">{item.alcoholTolerance}% ABV</span>
      </div>
      {item.flocculation && (
        <div className="detail-row">
          <span className="label">{t('inventory.details.flocculation')}</span>
          <span className="value">{item.flocculation}</span>
        </div>
      )}
      {(item.tempMin > 0 || item.tempMax > 0) && (
        <div className="detail-row">
          <span className="label">{t('inventory.details.temp_range')}</span>
          <span className="value">{item.tempMin}°C - {item.tempMax}°C</span>
        </div>
      )}
      {item.bestFor && (
        <div className="detail-row">
          <span className="label">{t('inventory.details.best_for')}</span>
          <span className="value">{item.bestFor}</span>
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

export default YeastDetail;
