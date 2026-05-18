import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { brewingApi } from '../../services/api';
import './Brewing.css';

const Brewing: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    brewingApi.getSessions().then(setSessions);
  }, []);

  return (
    <div className="brewing-container">
      <h1>Brassages</h1>
      <div className="session-list">
        {sessions.map(s => (
          <div key={s.id} className="session-card" onClick={() => navigate(`/brewing/${s.id}`)}>
            <h3>{s.name}</h3>
            <p>Statut: {s.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brewing;
