import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { recipeApi } from '../../services/api';
import type { Recipe } from '../../services/api';
import { getEbcColor } from '../../utils/colors';
import './Recipe.css';

interface RecipeListProps {
  onSelect: (externalId: string) => void;
  onCreate: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ onSelect, onCreate }) => {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipeApi.getRecipes()
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    const newRecipe = await recipeApi.createRecipe({
      name: "Ma Nouvelle Bière",
      batchVolume: 20.0,
      efficiency: 75.0,
      fermentables: [],
      hops: []
    });
    onCreate(newRecipe);
  };

  if (loading) return <div className="loading">{t('common.loading')}</div>;

  return (
    <div className="recipe-list-container">
      <header className="feature-header">
        <div>
          <h1>{t('recipe.list_title')}</h1>
          <p className="subtitle">Gérez vos créations et ajustez vos formules.</p>
        </div>
        <button className="btn btn-primary create-btn" onClick={handleCreate}>
          <span className="icon">➕</span> {t('recipe.create_button')}
        </button>
      </header>
      
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.externalId} className="recipe-card-modern" onClick={() => recipe.externalId && onSelect(recipe.externalId)}>
            <div className="recipe-card-header">
              <span className="recipe-icon">🍺</span>
              <h3>{recipe.name}</h3>
            </div>
            <div className="recipe-card-body">
              <div className="stat-badge abv">{recipe.abv?.toFixed(1)}% ABV</div>
              <div className="stat-badge ibu">{recipe.ibu?.toFixed(0)} IBU</div>
              <div className="stat-badge ebc" style={{ backgroundColor: getEbcColor(recipe.ebc) }}>{recipe.ebc?.toFixed(0)} EBC</div>
            </div>
            <div className="recipe-card-footer">
              <span>{recipe.batchVolume}L</span>
              <span>{recipe.efficiency}% eff.</span>
            </div>
          </div>
        ))}
        {recipes.length === 0 && (
          <div className="empty-state">
            <p>{t('common.no_items_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
