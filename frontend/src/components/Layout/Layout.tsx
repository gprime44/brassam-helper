import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">{t('layout.tabs.home')}</span>
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📦</span>
          <span className="nav-label">{t('layout.tabs.inventory')}</span>
        </NavLink>
        <NavLink to="/styles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📚</span>
          <span className="nav-label">{t('layout.tabs.styles')}</span>
        </NavLink>
        <NavLink to="/recipes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📝</span>
          <span className="nav-label">{t('layout.tabs.recipes')}</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
