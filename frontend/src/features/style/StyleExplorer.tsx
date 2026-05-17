import React from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './Styles/Styles';
import './Styles/Styles.css';

const StyleExplorer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="inventory-screen">
      <header className="feature-header">
        <div>
          <h1>Beer Styles</h1>
          <p className="subtitle">Exploration du catalogue BJCP</p>
        </div>
      </header>
      <Styles onSelectItem={(id) => navigate(`/styles/${id}`)} />
    </div>
  );
};

export default StyleExplorer;
