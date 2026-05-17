import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeList from './RecipeList';
import './Recipe.css';

const Recipe: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="recipe-container">
      <RecipeList 
        onSelect={(id) => navigate(`/recipes/${id}`)} 
        onCreate={(r) => r.externalId && navigate(`/recipes/${r.externalId}`)} 
      />
    </div>
  );
};

export default Recipe;
