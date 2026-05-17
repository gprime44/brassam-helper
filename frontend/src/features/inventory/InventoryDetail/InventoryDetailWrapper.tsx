import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventoryDetail from './InventoryDetail';

const InventoryDetailWrapper: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();

  if (!category || !id) return null;

  return (
    <InventoryDetail 
      id={Number(id)} 
      category={category as any} 
      onBack={() => navigate('/inventory')} 
    />
  );
};

export default InventoryDetailWrapper;
