import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { inventoryApi } from '../../../services/api';
import type { Yeast } from '../../../services/api';
import { getYeastIcon } from '../../../utils/typeIcons';
import './Yeasts.css';

interface YeastsProps {
  onSelectItem: (id: number) => void;
}

const Yeasts: React.FC<YeastsProps> = ({ onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<Yeast[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { t } = useTranslation();
  const observer = React.useRef<IntersectionObserver | null>(null);

  const lastItemElementRef = React.useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await inventoryApi.getYeasts(searchTerm, page);
        setData(prev => page === 0 ? result.content : [...prev, ...result.content]);
        setHasMore(!result.last);
      } catch (error) {
        console.error('Failed to fetch yeasts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (page === 0) {
      const timeoutId = setTimeout(fetchData, 300);
      return () => clearTimeout(timeoutId);
    } else {
      fetchData();
    }
  }, [searchTerm, page]);

  return (
    <div className="inventory-category">
      <div className="search-bar">
        <input
          type="text"
          placeholder={t('common.search_placeholder', { category: t('inventory.categories.yeasts').toLowerCase() })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="inventory-list">
        {data.map((item, index) => {
          const isLastItem = data.length === index + 1;
          return (
            <div 
              ref={isLastItem ? lastItemElementRef : null} 
              key={item.id} 
              className="inventory-item selectable" 
              onClick={() => onSelectItem(item.id)}
            >
              <div className="item-info">
                <span className="item-name">{item.type ? getYeastIcon(item.type) : '🧪'} {item.name}</span>
                <span className="item-details">{item.attenuationMin}-{item.attenuationMax}% Atten. • {item.type ? t(`inventory.details.types.${item.type}`) : t('common.other')}</span>
              </div>
              <div className="item-action"><span className="chevron">→</span></div>
            </div>
          );
        })}
        {loading && <div className="loading">{t('common.loading')}</div>}
        {!loading && data.length === 0 && <div className="empty">{t('common.no_items_found')}</div>}
      </div>
    </div>
  );
};

export default Yeasts;
