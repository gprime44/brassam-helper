import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { recipeApi } from '../../../services/api';
import type { Recipe } from '../../../services/api';
import { getEbcColor } from '../../../utils/colors';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeList = await recipeApi.getRecipes();
        setRecipes(recipeList.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <section className="welcome-banner">
          <h1>{t('dashboard.welcome_title', { name: user?.username })}</h1>
          <p>{t('dashboard.welcome_text')}</p>
        </section>

        <section className="quick-actions">
          <Link to="/recipes" className="action-card primary">
            <span className="action-icon">➕</span>
            <div className="action-content">
              <span className="action-title">{t('dashboard.actions.new_recipe')}</span>
              <span className="action-desc">Créez votre prochain brassin</span>
            </div>
          </Link>
          <Link to="/styles" className="action-card">
            <span className="action-icon">📚</span>
            <div className="action-content">
              <span className="action-title">{t('dashboard.actions.explore_styles')}</span>
              <span className="action-desc">Parcourez le guide BJCP</span>
            </div>
          </Link>
        </section>
      </header>

      <div className="dashboard-content">
        <section className="recent-recipes">
          <h3>{t('dashboard.sections.recent_recipes')}</h3>
          <div className="recipe-feed">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <Link key={recipe.externalId} to={`/recipes/${recipe.externalId}`} className="compact-recipe-card">
                  <div className="ebc-indicator" style={{ backgroundColor: getEbcColor(recipe.ebc) }}></div>
                  <div className="recipe-info">
                    <h4>{recipe.name}</h4>
                    <div className="recipe-stats">
                      <span>{recipe.abv?.toFixed(1)}% ABV</span>
                      <span>•</span>
                      <span>{recipe.ibu?.toFixed(0)} IBU</span>
                    </div>
                  </div>
                  <span className="arrow">→</span>
                </Link>
              ))
            ) : (
              <div className="empty-recipes">
                <p>{t('dashboard.no_recipes')}</p>
                <Link to="/recipes" className="btn-secondary">{t('dashboard.actions.new_recipe')}</Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
