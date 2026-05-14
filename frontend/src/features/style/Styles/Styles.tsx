import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { styleApi } from '../../../services/api';
import type { Style } from '../../../services/api';
import { getEbcColor } from '../../../utils/colors';
import './Styles.css';

interface StylesProps {
  onSelectItem: (id: number) => void;
}

const Styles: React.FC<StylesProps> = ({ onSelectItem }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<Style[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await styleApi.getStyles(searchTerm, page);
        setData(prev => page === 0 ? result.content : [...prev, ...result.content]);
        setHasMore(!result.last);
      } catch (error) {
        console.error('Failed to fetch styles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchData, page === 0 ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="styles-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder={t('common.search_placeholder', { category: t('inventory.categories.styles') })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="styles-grid" onScroll={handleScroll}>
        {data.map((style) => (
          <div 
            key={style.id} 
            className="style-card" 
            onClick={() => onSelectItem(style.id)}
          >
            <div className="style-card-header">
              <h3>{style.name}</h3>
            </div>
            <p className="style-category">{style.category}</p>
            <div className="style-ranges-mini">
              <span className="stat-badge abv">{style.abvMin}-{style.abvMax}% ABV</span>
              <span className="stat-badge ibu">{style.ibuMin}-{style.ibuMax} IBU</span>
              <span className="stat-badge ebc" style={{ backgroundColor: getEbcColor((style.ebcMin + style.ebcMax) / 2) }}>
                {style.ebcMin}-{style.ebcMax} EBC
              </span>
            </div>
          </div>
        ))}
        {loading && <div className="loading">{t('common.loading')}</div>}
        {!loading && data.length === 0 && (
          <div className="empty">{t('common.no_items_found')}</div>
        )}
      </div>
    </div>
  );
};

export default Styles;
