import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = (i18n.language || 'en').split('-')[0];

  return (
    <div className="language-selector">
      <button 
        className={currentLanguage === 'en' ? 'active' : ''} 
        onClick={() => changeLanguage('en')}
        title="English"
      >
        <svg viewBox="0 0 640 480" width="20" height="15">
          <path fill="#012169" d="M0 0h640v480H0z"/>
          <path fill="#FFF" d="m0 0 640 480m0-480L0 480" stroke="#FFF" stroke-width="60"/>
          <path stroke="#C8102E" stroke-width="40" d="m0 0 640 480m0-480L0 480"/>
          <path fill="#FFF" d="M320 0v480M0 240h640" stroke="#FFF" stroke-width="100"/>
          <path stroke="#C8102E" stroke-width="60" d="M320 0v480M0 240h640"/>
        </svg>
      </button>
      <button 
        className={currentLanguage === 'fr' ? 'active' : ''} 
        onClick={() => changeLanguage('fr')}
        title="Français"
      >
        <svg viewBox="0 0 640 480" width="20" height="15">
          <path fill="#fff" d="M0 0h640v480H0z"/>
          <path fill="#002654" d="M0 0h213.3v480H0z"/>
          <path fill="#ed2939" d="M426.7 0H640v480H426.7z"/>
        </svg>
      </button>
    </div>
  );
};

export default LanguageSelector;
