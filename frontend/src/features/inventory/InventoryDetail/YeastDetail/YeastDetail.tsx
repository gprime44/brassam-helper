import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Yeast } from '../../../../services/api';
import { getYeastIcon } from '../../../../utils/typeIcons';

interface YeastDetailProps {
  item: Yeast;
}

const YeastDetail: React.FC<YeastDetailProps> = ({ item }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="detail-row">
        <span className="label">{t('inventory.details.type')}</span>
        <span className="value">{getYeastIcon(item.type)} {t(`inventory.details.types.${item.type}`)}</span>
      </div>
      <div className="detail-row">
        <span className="label">{t('inventory.details.attenuation')}</span>
        <span className="value">{item.attenuationMin}% - {item.attenuationMax}%</span>
      </div>
      <div className="detail-row">
        <span className="label">{t('inventory.details.alcohol_tolerance')}</span>
        <span className="value">{item.alcoholTolerance}% ABV</span>
      </div>
    </>
  );
};

export default YeastDetail;
