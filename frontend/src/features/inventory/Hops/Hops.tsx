import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { inventoryApi } from '../../../services/api';
import type { Hop } from '../../../services/api';
import './Hops.css';

interface HopsProps {
  onSelectItem: (id: number) => void;
}

const Hops: React.FC<HopsProps> = ({ onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<Hop[]>([]);
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
        const result = await inventoryApi.getHops(searchTerm, page);
        setData(prev => page === 0 ? result.content : [...prev, ...result.content]);
        setHasMore(!result.last);
      } catch (error) {
        console.error('Failed to fetch hops:', error);
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
          placeholder={t('common.search_placeholder', { category: t('inventory.categories.hops').toLowerCase() })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="inventory-list">
        {data.map((item, index) => {
          if (data.length === index + 1) {
            return (
              <div ref={lastItemElementRef} key={item.id} className="inventory-item selectable" onClick={() => onSelectItem(item.id)}>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-details">{item.alphaAcid}% Alpha • {item.origin}</span>
                </div>
                <div className="item-action"><span className="chevron">→</span></div>
              </div>
            );
          } else {
            return (
              <div key={item.id} className="inventory-item selectable" onClick={() => onSelectItem(item.id)}>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-details">{item.alphaAcid}% Alpha • {item.origin}</span>
                </div>
                <div className="item-action"><span className="chevron">→</span></div>
              </div>
            );
          }
        })}
        {loading && <div className="loading">{t('common.loading')}</div>}
        {!loading && data.length === 0 && <div className="empty">{t('common.no_items_found')}</div>}
      </div>
    </div>
  );
};

export default Hops;
