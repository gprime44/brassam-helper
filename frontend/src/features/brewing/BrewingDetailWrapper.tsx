import React from 'react';
import { useParams } from 'react-router-dom';
import BrewingSessionDetail from './BrewingSessionDetail';

const BrewingDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <BrewingSessionDetail sessionId={parseInt(id)} />
  );
};

export default BrewingDetailWrapper;
