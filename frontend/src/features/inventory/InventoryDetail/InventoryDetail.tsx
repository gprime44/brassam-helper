import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { inventoryApi } from '../../../services/api';
import type { Fermentable, Hop, Yeast } from '../../../services/api';
import FermentableDetail from './FermentableDetail/FermentableDetail';
import HopDetail from './HopDetail/HopDetail';
import YeastDetail from './YeastDetail/YeastDetail';
import './InventoryDetail.css';

interface InventoryDetailProps {
  id: number;
  category: 'fermentables' | 'hops' | 'yeasts';
  onBack: () => void;
}

const InventoryDetail: React.FC<InventoryDetailProps> = ({ id, category, onBack }) => {
  const [item, setItem] = useState<Fermentable | Hop | Yeast | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        let result;
        if (category === 'fermentables') result = await inventoryApi.getFermentableById(id);
        else if (category === 'hops') result = await inventoryApi.getHopById(id);
        else result = await inventoryApi.getYeastById(id);
        setItem(result);
      } catch (error) {
        console.error('Failed to fetch item detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, category]);

  if (loading) return <div className="loading">{t('common.loading_details')}</div>;
  if (!item) return <div className="error">{t('common.error_not_found')}</div>;

  return (
    <div className="inventory-detail">
      <button className="back-button" onClick={onBack}>← {t('common.back_to_list')}</button>
      
      <div className="detail-card">
        <header className="detail-header">
          <span className="category-badge">
            {t(`inventory.details.${category.slice(0, -1)}`)}
          </span>
          <h2>{item.name}</h2>
        </header>

        <div className="detail-content">
          {category === 'fermentables' && <FermentableDetail item={item as Fermentable} />}
          {category === 'hops' && <HopDetail item={item as Hop} />}
          {category === 'yeasts' && <YeastDetail item={item as Yeast} />}
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;
