import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-brand">
          <span className="brand-logo">🍺</span>
          <h1>{t('layout.title')}</h1>
        </div>
        
        <div className="header-actions">
          {user && (
            <div className="user-dropdown-container" ref={menuRef}>
              <button className={`user-menu-trigger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <span className="user-avatar">{user.username.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.username}</span>
                <span className="dropdown-arrow">{isMenuOpen ? '▴' : '▾'}</span>
              </button>
              
              {isMenuOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-section">
                    <span className="dropdown-label">{t('common.language') || 'Langue'}</span>
                    <LanguageSelector />
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <span className="item-icon">🚪</span>
                    <span>{t('common.logout') || 'Déconnexion'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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
