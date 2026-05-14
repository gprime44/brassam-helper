import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { styleApi } from '../../services/api';
import type { StyleDetail as StyleDetailType } from '../../services/api';
import Styles from './Styles/Styles';
import StyleDetail from './StyleDetail/StyleDetail';
import './Styles/Styles.css'; // Using Styles.css for shared styles

const StyleExplorer: React.FC = () => {
  const { t } = useTranslation();
  const [selectedStyleId, setSelectedStyleId] = useState<number | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleDetailType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedStyleId === null) {
      setSelectedStyle(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await styleApi.getStyleById(selectedStyleId);
        setSelectedStyle(data);
      } catch (error) {
        console.error('Failed to fetch style detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [selectedStyleId]);

  if (selectedStyleId !== null) {
    return (
      <div className="inventory-detail-container">
        <button className="back-button" onClick={() => setSelectedStyleId(null)}>
          ← {t('common.back_to_list')}
        </button>

        {loading ? (
          <div className="loading">{t('common.loading_details')}</div>
        ) : selectedStyle ? (
          <div className="detail-card">
            <header className="detail-header">
              <h3>{selectedStyle.name}</h3>
              <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: '14px' }}>{selectedStyle.category}</p>
            </header>
            <div className="detail-content">
              <StyleDetail item={selectedStyle} />
            </div>
          </div>
        ) : (
          <div className="error">{t('common.error_not_found')}</div>
        )}
      </div>
    );
  }

  return (
    <div className="inventory-screen">
      <header className="feature-header">
        <div>
          <h1>Beer Styles</h1>
          <p className="subtitle">Exploration du catalogue BJCP</p>
        </div>
      </header>
      <Styles onSelectItem={setSelectedStyleId} />
    </div>
  );
};

export default StyleExplorer;
