import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <section className="welcome-card">
        <h2>{t('dashboard.welcome_title', { name: user?.username })}</h2>
        <p>{t('dashboard.welcome_text')}</p>
        
        <div className="card">
          <p>{t('dashboard.quick_action')}</p>
          <button
            type="button"
            className="counter"
            onClick={() => setCount((c) => c + 1)}
          >
            {t('dashboard.session_count', { count })}
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">12</span>
          <span className="stat-label">{t('dashboard.stats.hops')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">5</span>
          <span className="stat-label">{t('dashboard.stats.fermentables')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">3</span>
          <span className="stat-label">{t('dashboard.stats.yeasts')}</span>
        </div>
      </section>

      <section className="recent-recipes">
        <h3>{t('dashboard.recent_recipes')}</h3>
        <div className="recipe-list">
          <div className="recipe-card">IPA Tropicale</div>
          <div className="recipe-card">Stout Impérial</div>
          <div className="recipe-card">Blanche de Soif</div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
