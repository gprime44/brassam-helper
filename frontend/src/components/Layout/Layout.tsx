import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div className="layout">
      <header className="layout-header">
        <h1>{t('layout.title')}</h1>
        <LanguageSelector />
      </header>
      
      <main className="layout-content">
        {children}
      </main>

      <nav className="layout-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onTabChange('home')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">{t('layout.tabs.home')}</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => onTabChange('inventory')}
        >
          <span className="nav-icon">📦</span>
          <span className="nav-label">{t('layout.tabs.inventory')}</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">📝</span>
          <span className="nav-label">{t('layout.tabs.recipes')}</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">{t('layout.tabs.settings')}</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
