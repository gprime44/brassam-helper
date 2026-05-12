import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  recipeApi, inventoryApi 
} from '../../services/api';
import type { 
  Recipe, Fermentable, Hop, Yeast 
} from '../../services/api';

interface RecipeDetailProps {
  externalId: string;
  onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ externalId, onBack }) => {
  const { t } = useTranslation();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const [inventory, setInventory] = useState<{
    fermentables: Record<number, string>;
    hops: Record<number, string>;
    yeasts: Record<number, string>;
  }>({ fermentables: {}, hops: {}, yeasts: {} });

  const [showAddFerm, setShowAddFerm] = useState(false);
  const [showAddHop, setShowAddHop] = useState(false);
  const [showAddYeast, setShowAddYeast] = useState(false);

  const [allFerm, setAllFerm] = useState<Fermentable[]>([]);
  const [allHops, setAllHops] = useState<Hop[]>([]);
  const [allYeasts, setAllYeasts] = useState<Yeast[]>([]);

  useEffect(() => {
    recipeApi.getRecipe(externalId).then(setRecipe).finally(() => setLoading(false));
    
    Promise.all([
      inventoryApi.getFermentables('', 0, 1000),
      inventoryApi.getHops('', 0, 1000),
      inventoryApi.getYeasts('', 0, 1000)
    ]).then(([f, h, y]) => {
      setAllFerm(f.content);
      setAllHops(h.content);
      setAllYeasts(y.content);
      
      const fMap: Record<number, string> = {};
      f.content.forEach(i => fMap[i.id] = i.name);
      const hMap: Record<number, string> = {};
      h.content.forEach(i => hMap[i.id] = i.name);
      const yMap: Record<number, string> = {};
      y.content.forEach(i => yMap[i.id] = i.name);
      
      setInventory({ fermentables: fMap, hops: hMap, yeasts: yMap });
    });
  }, [externalId]);

  const handleUpdateHeader = (field: keyof Recipe, value: string | number) => {
    if (!recipe) return;
    const updated = { ...recipe, [field]: value };
    recipeApi.updateRecipe(externalId, updated).then(setRecipe);
  };

  const handleAddFermentable = (fermentableId: number, amount: number) => {
    recipeApi.addFermentable(externalId, { fermentableId, amount }).then(setRecipe);
    setShowAddFerm(false);
  };

  const handleAddHop = (hopId: number, amount: number, phase: any, duration: number) => {
    recipeApi.addHop(externalId, { hopId, amount, phase, duration }).then(setRecipe);
    setShowAddHop(false);
  };

  const handleUpdateYeast = (yeastId: number, amount: number) => {
    recipeApi.updateYeast(externalId, { yeastId, amount }).then(setRecipe);
    setShowAddYeast(false);
  };

  if (loading || !recipe) return <div className="loading">{t('common.loading')}</div>;

  return (
    <div className="recipe-detail-container">
      <button className="back-link" onClick={onBack}>
        <span>←</span> {t('common.back_to_list')}
      </button>

      <header className="feature-header">
        <h1>{recipe.name}</h1>
        <p className="subtitle">Configuration et ajustement des ingrédients.</p>
      </header>

      <div className="recipe-stats-banner">
        <div className="stat-item">
          <label>{t('recipe.stats.og')}</label>
          <span>{recipe.og?.toFixed(3)}</span>
        </div>
        <div className="stat-item">
          <label>{t('recipe.stats.fg')}</label>
          <span>{recipe.fg?.toFixed(3)}</span>
        </div>
        <div className="stat-item">
          <label>{t('recipe.stats.abv')}</label>
          <span>{recipe.abv?.toFixed(1)}%</span>
        </div>
        <div className="stat-item">
          <label>{t('recipe.stats.ibu')}</label>
          <span>{recipe.ibu?.toFixed(0)}</span>
        </div>
        <div className="stat-item">
          <label>{t('recipe.stats.ebc')}</label>
          <span>{recipe.ebc?.toFixed(0)}</span>
        </div>
      </div>

      <div className="recipe-sections">
        {/* CONFIGURATION */}
        <section className="detail-section">
          <h3>⚙️ Configuration</h3>
          <div className="form-group">
            <label>{t('recipe.form.name')}</label>
            <input 
              value={recipe.name} 
              onBlur={(e) => handleUpdateHeader('name', e.target.value)}
              onChange={(e) => setRecipe({...recipe, name: e.target.value})}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('recipe.form.batch_volume')}</label>
              <input 
                type="number" 
                value={recipe.batchVolume} 
                onBlur={(e) => handleUpdateHeader('batchVolume', Number(e.target.value))}
                onChange={(e) => setRecipe({...recipe, batchVolume: Number(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>{t('recipe.form.efficiency')}</label>
              <input 
                type="number" 
                value={recipe.efficiency} 
                onBlur={(e) => handleUpdateHeader('efficiency', Number(e.target.value))}
                onChange={(e) => setRecipe({...recipe, efficiency: Number(e.target.value)})}
              />
            </div>
          </div>
        </section>

        {/* FERMENTABLES */}
        <section className="detail-section">
          <h3>🌾 {t('inventory.categories.fermentables')}</h3>
          <div className="table-responsive">
            <table className="ingredient-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Quantité</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {recipe.fermentables.map(f => (
                  <tr key={f.id}>
                    <td>{inventory.fermentables[f.fermentableId] || '...'}</td>
                    <td>{f.amount} g</td>
                    <td>
                      <button className="delete-btn" onClick={() => f.id && recipeApi.deleteFermentable(externalId, f.id).then(setRecipe)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showAddFerm ? (
            <AddIngredientForm 
              items={allFerm} 
              onAdd={(id, qty) => handleAddFermentable(id, qty)} 
              onCancel={() => setShowAddFerm(false)} 
            />
          ) : (
            <button className="add-btn" onClick={() => setShowAddFerm(true)}>+ {t('recipe.form.add_fermentable')}</button>
          )}
        </section>

        {/* HOPS */}
        <section className="detail-section">
          <h3>🌿 {t('inventory.categories.hops')}</h3>
          <div className="table-responsive">
            <table className="ingredient-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Quantité</th>
                  <th>Phase</th>
                  <th>Durée</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {recipe.hops.map(h => (
                  <tr key={h.id}>
                    <td>{inventory.hops[h.hopId] || '...'}</td>
                    <td>{h.amount} g</td>
                    <td><span className="stat-badge ibu">{h.phase}</span></td>
                    <td>{h.duration} min</td>
                    <td>
                      <button className="delete-btn" onClick={() => h.id && recipeApi.deleteHop(externalId, h.id).then(setRecipe)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showAddHop ? (
            <AddHopForm 
              items={allHops} 
              onAdd={(id, qty, phase, dur) => handleAddHop(id, qty, phase, dur)} 
              onCancel={() => setShowAddHop(false)} 
            />
          ) : (
            <button className="add-btn" onClick={() => setShowAddHop(true)}>+ {t('recipe.form.add_hop')}</button>
          )}
        </section>

        {/* YEAST */}
        <section className="detail-section">
          <h3>🧪 {t('inventory.categories.yeasts')}</h3>
          {recipe.yeast ? (
            <div className="yeast-info-card">
              <div className="yeast-details">
                <strong>{inventory.yeasts[recipe.yeast.yeastId] || '...'}</strong>
                <span>{recipe.yeast.amount} g</span>
              </div>
              <button className="primary-button" onClick={() => setShowAddYeast(true)}>Modifier</button>
            </div>
          ) : (
            <button className="add-btn" onClick={() => setShowAddYeast(true)}>+ {t('recipe.form.add_yeast')}</button>
          )}
          {showAddYeast && (
            <AddIngredientForm 
              items={allYeasts} 
              onAdd={(id, qty) => handleUpdateYeast(id, qty)} 
              onCancel={() => setShowAddYeast(false)} 
            />
          )}
        </section>
      </div>
    </div>
  );
};

const AddIngredientForm: React.FC<{ items: any[], onAdd: (id: number, qty: number) => void, onCancel: () => void }> = ({ items, onAdd, onCancel }) => {
  const [id, setId] = useState(items[0]?.id || 0);
  const [qty, setQty] = useState(1000);
  return (
    <div className="inline-form">
      <div className="form-group">
        <label>Ingrédient</label>
        <select value={id} onChange={e => setId(Number(e.target.value))}>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Quantité (g)</label>
        <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="primary-button" onClick={() => onAdd(id, qty)}>Ajouter</button>
        <button className="secondary-button" onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
};

const AddHopForm: React.FC<{ items: any[], onAdd: (id: number, qty: number, phase: string, dur: number) => void, onCancel: () => void }> = ({ items, onAdd, onCancel }) => {
  const [id, setId] = useState(items[0]?.id || 0);
  const [qty, setQty] = useState(20);
  const [phase, setPhase] = useState('BOIL');
  const [dur, setDur] = useState(60);
  return (
    <div className="inline-form">
      <div className="form-group">
        <label>Houblon</label>
        <select value={id} onChange={e => setId(Number(e.target.value))}>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Quantité (g)</label>
        <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Phase</label>
        <select value={phase} onChange={e => setPhase(e.target.value)}>
          <option value="BOIL">BOIL</option>
          <option value="HOPSTAND">HOPSTAND</option>
          <option value="DRY_HOP">DRY_HOP</option>
        </select>
      </div>
      <div className="form-group">
        <label>Durée (min)</label>
        <input type="number" value={dur} onChange={e => setDur(Number(e.target.value))} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="primary-button" onClick={() => onAdd(id, qty, phase, dur)}>Ajouter</button>
        <button className="secondary-button" onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
};

export default RecipeDetail;
