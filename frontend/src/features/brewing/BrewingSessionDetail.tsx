import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { brewingApi, BrewingSessionDetail as SessionDetailType } from '../../services/api';
import BrewingChecklist from './BrewingChecklist';
import FermentationChart from './FermentationChart';
import AddReadingForm from './AddReadingForm';

interface BrewingSessionDetailProps {
  sessionId: number;
}

const BrewingSessionDetail: React.FC<BrewingSessionDetailProps> = ({ sessionId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = () => {
    brewingApi.getSessionDetail(sessionId).then(data => {
      setSession(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const handleToggleTask = (taskId: number) => {
    brewingApi.toggleTask(taskId).then(() => {
      loadSession();
    });
  };

  if (loading || !session) return <div>{t('common.loading')}</div>;

  return (
    <div className="brewing-session-detail">
      <button className="back-button" onClick={() => navigate('/brewing')}>
        ← {t('common.back_to_list')}
      </button>
      
      <h1>{session.name}</h1>
      <p>Status: {session.status}</p>
      
      <BrewingChecklist 
        tasks={session.tasks} 
        onTaskToggle={handleToggleTask} 
      />

      <div className="monitoring-section">
        <FermentationChart readings={session.readings} />
        <AddReadingForm sessionId={sessionId} onAdded={loadSession} />
      </div>
    </div>
  );
};

export default BrewingSessionDetail;
