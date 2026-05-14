import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { inventoryApi } from '../../../services/api';
import type { FermentableDetail, HopDetail, YeastDetail } from '../../../services/api';
import FermentableDetailView from './FermentableDetail/FermentableDetail';
import HopDetailView from './HopDetail/HopDetail';
import YeastDetailView from './YeastDetail/YeastDetail';
import './InventoryDetail.css';

interface InventoryDetailProps {
  id: number;
  category: 'fermentable' | 'hop' | 'yeast';
  onBack: () => void;
}

const InventoryDetail: React.FC<InventoryDetailProps> = ({ id, category, onBack }) => {
  const { t } = useTranslation();
  const [item, setItem] = useState<FermentableDetail | HopDetail | YeastDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchItem = async () => {
      try {
        let data;
        if (category === 'fermentable') data = await inventoryApi.getFermentableById(id);
        else if (category === 'hop') data = await inventoryApi.getHopById(id);
        else data = await inventoryApi.getYeastById(id);
        setItem(data);
      } catch (error) {
        console.error('Failed to fetch detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, category]);

  if (loading) return <div className="loading">{t('common.loading_details')}</div>;
  if (!item) return <div className="error">{t('common.error_not_found')}</div>;

  return (
    <div className="inventory-detail-container">
      <button className="back-button" onClick={onBack}>
        ← {t('common.back_to_list')}
      </button>

      <div className="detail-card">
        <header className="detail-header">
          <span className="category-badge">{t(`inventory.categories.${category}s`)}</span>
          <h3>{item.name}</h3>
        </header>

        <div className="detail-content">
          {category === 'fermentable' && <FermentableDetailView item={item as FermentableDetail} />}
          {category === 'hop' && <HopDetailView item={item as HopDetail} />}
          {category === 'yeast' && <YeastDetailView item={item as YeastDetail} />}
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;
