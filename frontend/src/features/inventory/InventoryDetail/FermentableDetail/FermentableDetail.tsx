import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Fermentable } from '../../../../services/api';
import { getFermentableIcon } from '../../../../utils/typeIcons';

interface FermentableDetailProps {
  item: Fermentable;
}

const FermentableDetail: React.FC<FermentableDetailProps> = ({ item }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="detail-row">
        <span className="label">{t('inventory.details.type')}</span>
        <span className="value">{getFermentableIcon(item.type)} {t(`inventory.details.types.${item.type}`)}</span>
      </div>
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
    </>
  );
};

export default FermentableDetail;
