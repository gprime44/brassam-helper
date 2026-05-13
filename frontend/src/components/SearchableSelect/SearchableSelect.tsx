import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './SearchableSelect.css';

interface SearchableSelectProps<T> {
  fetchFn: (searchTerm: string, page: number) => Promise<{ content: T[], last: boolean }>;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
  label?: string;
  initialItem?: T | null;
}

const SearchableSelect = <T extends { id: number, name: string }>({
  fetchFn,
  onSelect,
  renderItem,
  placeholder,
  label,
  initialItem
}: SearchableSelectProps<T>) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(initialItem || null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialItem) {
      setSelectedItem(initialItem);
    }
  }, [initialItem]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchFn(searchTerm, page);
        setData(prev => page === 0 ? result.content : [...prev, ...result.content]);
        setHasMore(!result.last);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchData, page === 0 ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, page, fetchFn, isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const handleSelect = (item: T) => {
    setSelectedItem(item);
    onSelect(item);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="searchable-select" ref={dropdownRef}>
      {label && <label className="select-label">{label}</label>}
      <div className="select-control" onClick={() => setIsOpen(!isOpen)}>
        <span className={`select-value ${!selectedItem ? 'placeholder' : ''}`}>
          {selectedItem ? selectedItem.name : (placeholder || t('common.select_item'))}
        </span>
        <span className="select-arrow">▾</span>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              autoFocus
              placeholder={t('common.search_placeholder_generic') || "Rechercher..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="select-list" onScroll={handleScroll} ref={listRef}>
            {data.map((item) => (
              <div
                key={item.id}
                className={`select-option ${selectedItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => handleSelect(item)}
              >
                {renderItem(item)}
              </div>
            ))}
            {loading && <div className="select-loading">{t('common.loading')}</div>}
            {!loading && data.length === 0 && (
              <div className="select-empty">{t('common.no_items_found')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
