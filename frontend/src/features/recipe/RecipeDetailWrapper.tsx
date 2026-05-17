import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeDetail from './RecipeDetail';

const RecipeDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <RecipeDetail 
      externalId={id} 
      onBack={() => navigate('/recipes')} 
    />
  );
};

export default RecipeDetailWrapper;
