import React, { useState } from 'react';
import RecipeList from './RecipeList';
import RecipeDetail from './RecipeDetail';
import './Recipe.css';

const Recipe: React.FC = () => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  return (
    <div className="recipe-container">
      {selectedRecipeId ? (
        <RecipeDetail 
          externalId={selectedRecipeId} 
          onBack={() => setSelectedRecipeId(null)} 
        />
      ) : (
        <RecipeList 
          onSelect={setSelectedRecipeId} 
          onCreate={(r) => r.externalId && setSelectedRecipeId(r.externalId)} 
        />
      )}
    </div>
  );
};

export default Recipe;
