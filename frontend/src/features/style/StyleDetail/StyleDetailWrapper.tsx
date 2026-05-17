import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { styleApi } from '../../../services/api';
import type { StyleDetail as StyleDetailType } from '../../../services/api';
import StyleDetail from './StyleDetail';

const StyleDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedStyle, setSelectedStyle] = useState<StyleDetailType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await styleApi.getStyleById(Number(id));
        setSelectedStyle(data);
      } catch (error) {
        console.error('Failed to fetch style detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (!id) return null;

  return (
    <div className="inventory-detail-container">
      <button className="back-button" onClick={() => navigate('/styles')}>
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
};

export default StyleDetailWrapper;
