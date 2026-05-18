import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  recipeApi, inventoryApi, styleApi, brewingApi 
} from '../../services/api';
import type { 
  Recipe, RecipeFermentable, RecipeHop, Style, RecipeMashStep 
} from '../../services/api';
import RangeGauge from '../../components/RangeGauge/RangeGauge';
import SearchableSelect from '../../components/SearchableSelect/SearchableSelect';
import { getFermentableIcon, getYeastIcon } from '../../utils/typeIcons';

interface RecipeDetailProps {
  externalId: string;
  onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ externalId, onBack }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);

  const [inventory, setInventory] = useState<{
    fermentables: Record<number, string>;
    hops: Record<number, string>;
    yeasts: Record<number, string>;
  }>({ fermentables: {}, hops: {}, yeasts: {} });

  const [showAddFerm, setShowAddFerm] = useState(false);
  const [showAddHop, setShowAddHop] = useState(false);
  const [showAddYeast, setShowAddYeast] = useState(false);

  const [editingFermentable, setEditingFermentable] = useState<RecipeFermentable | null>(null);
  const [editingHop, setEditingHop] = useState<RecipeHop | null>(null);
  const [editingMashStep, setEditingMashStep] = useState<RecipeMashStep | null>(null);
  const [showAddMashStep, setShowAddMashStep] = useState(false);

  useEffect(() => {
    recipeApi.getRecipe(externalId).then(r => {
      setRecipe(r);
      if (r.styleId) {
        styleApi.getStyleById(r.styleId).then(setSelectedStyle);
      }
    }).finally(() => setLoading(false));
    
    inventoryApi.getFermentables('', 0, 1000).then(f => {
      const fMap: Record<number, string> = {};
      f.content.forEach(i => fMap[i.id] = i.name);
      setInventory(prev => ({ ...prev, fermentables: fMap }));
    });
    inventoryApi.getHops('', 0, 1000).then(h => {
      const hMap: Record<number, string> = {};
      h.content.forEach(i => hMap[i.id] = i.name);
      setInventory(prev => ({ ...prev, hops: hMap }));
    });
    inventoryApi.getYeasts('', 0, 1000).then(y => {
      const yMap: Record<number, string> = {};
      y.content.forEach(i => yMap[i.id] = i.name);
      setInventory(prev => ({ ...prev, yeasts: yMap }));
    });
  }, [externalId]);

  const handleUpdateHeader = (field: keyof Recipe, value: any) => {
    if (!recipe) return;
    const updated = { ...recipe, [field]: value };
    recipeApi.updateRecipe(externalId, updated).then(setRecipe);
  };

  const handleStyleSelect = (style: Style) => {
    setSelectedStyle(style);
    handleUpdateHeader('styleId', style.id);
  };

  const handleAddFermentable = (fermentableId: number, amount: number) => {
    recipeApi.addFermentable(externalId, { fermentableId, amount }).then(setRecipe);
    setShowAddFerm(false);
    setEditingFermentable(null);
  };

  const handleUpdateFermentable = (id: number, fermentableId: number, amount: number) => {
    recipeApi.updateFermentable(externalId, id, { fermentableId, amount }).then(setRecipe);
    setEditingFermentable(null);
  };

  const handleAddHop = (hopId: number, amount: number, phase: any, duration: number) => {
    recipeApi.addHop(externalId, { hopId, amount, phase, duration }).then(setRecipe);
    setShowAddHop(false);
    setEditingHop(null);
  };

  const handleUpdateHop = (id: number, hopId: number, amount: number, phase: any, duration: number) => {
    recipeApi.updateHop(externalId, id, { hopId, amount, phase, duration }).then(setRecipe);
    setEditingHop(null);
  };

  const handleAddMashStep = (name: string, temperature: number, duration: number) => {
    const nextOrder = recipe?.mashSteps.length || 0;
    recipeApi.addMashStep(externalId, { name, temperature, duration, stepOrder: nextOrder }).then(setRecipe);
    setShowAddMashStep(false);
    setEditingMashStep(null);
  };

  const handleUpdateMashStep = (id: number, name: string, temperature: number, duration: number) => {
    recipeApi.updateMashStep(externalId, id, { name, temperature, duration }).then(setRecipe);
    setEditingMashStep(null);
  };

  const handleUpdateYeast = (yeastId: number, amount: number) => {
    recipeApi.updateYeast(externalId, { yeastId, amount }).then(setRecipe);
    setShowAddYeast(false);
  };

  if (loading || !recipe) return <div className="loading">{t('common.loading')}</div>;

  return (
    <div className="recipe-detail">
      <button className="back-button" onClick={onBack}>← {t('common.back_to_list')}</button>

      <header className="feature-header">
        <h1>{recipe.name}</h1>
        <button 
          className="btn btn-primary" 
          onClick={async () => {
            try {
              const id = await brewingApi.startSession(externalId);
              if (id) {
                navigate(`/brewing/${id}`);
              } else {
                console.error("No ID returned from startSession");
              }
            } catch (err) {
              console.error("Failed to start session:", err);
            }
          }}
        >
          🚀 Lancer ce brassage
        </button>
      </header>

      <div className="recipe-stats-gauges">
        <RangeGauge label="OG" value={recipe.og || 1.000} min={selectedStyle?.ogMin || 1.040} max={selectedStyle?.ogMax || 1.060} decimals={3} />
        <RangeGauge label="FG" value={recipe.fg || 1.000} min={selectedStyle?.fgMin || 1.008} max={selectedStyle?.fgMax || 1.015} decimals={3} />
        <RangeGauge label="ABV" value={recipe.abv || 0} min={selectedStyle?.abvMin || 4.5} max={selectedStyle?.abvMax || 6.5} unit="%" />
        <RangeGauge label="IBU" value={recipe.ibu || 0} min={selectedStyle?.ibuMin || 20} max={selectedStyle?.ibuMax || 40} decimals={0} />
        <RangeGauge label="EBC" value={recipe.ebc || 0} min={selectedStyle?.ebcMin || 10} max={selectedStyle?.ebcMax || 30} decimals={0} />
      </div>

      <div className="recipe-sections">
        <div className="detail-card">
          <header className="detail-header">
            <span className="category-badge">Configuration</span>
            <h3>Paramètres de brassage</h3>
          </header>
          <div className="detail-content">
            <div className="form-row">
              <div className="form-group">
                <label>{t('recipe.form.name')}</label>
                <input 
                  className="input-styled"
                  value={recipe.name} 
                  onBlur={(e) => handleUpdateHeader('name', e.target.value)}
                  onChange={(e) => setRecipe({...recipe, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <SearchableSelect 
                  label="Style BJCP"
                  fetchFn={styleApi.getStyles}
                  initialItem={selectedStyle}
                  onSelect={handleStyleSelect}
                  renderItem={(s) => <span>{s.name}</span>}
                  placeholder="Rechercher un style..."
                />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>{t('recipe.form.batch_volume')}</label>
                <input 
                  type="number" 
                  className="input-styled"
                  value={recipe.batchVolume} 
                  onBlur={(e) => handleUpdateHeader('batchVolume', Number(e.target.value))}
                  onChange={(e) => setRecipe({...recipe, batchVolume: Number(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>{t('recipe.form.efficiency')}</label>
                <input 
                  type="number" 
                  className="input-styled"
                  value={recipe.efficiency} 
                  onBlur={(e) => handleUpdateHeader('efficiency', Number(e.target.value))}
                  onChange={(e) => setRecipe({...recipe, efficiency: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FERMENTABLES */}
        <section className="detail-section">
          <h3>🌾 {t('inventory.categories.fermentables')}</h3>
          <div className="ingredient-list">
            {recipe.fermentables.map(f => (
              editingFermentable?.id === f.id ? (
                <AddIngredientForm 
                  key={f.id}
                  category="fermentable"
                  initialValues={{ 
                    id: f.fermentableId, 
                    name: inventory.fermentables[f.fermentableId] || '...',
                    amount: f.amount 
                  }}
                  onAdd={(id, qty) => f.id && handleUpdateFermentable(f.id, id, qty)} 
                  onCancel={() => setEditingFermentable(null)} 
                />
              ) : (
                <div key={f.id} className="ingredient-item-card">
                  <span className="ing-name">{inventory.fermentables[f.fermentableId] || '...'}</span>
                  <div className="ing-details">
                    <div className="ing-detail-item">
                      <span className="ing-label">{t('recipe.form.amount')}:</span>
                      <span>{f.amount} g</span>
                    </div>
                  </div>
                  <div className="ing-action">
                    <button className="btn btn-sm btn-outline" onClick={() => setEditingFermentable(f)}>Modifier</button>
                    <button className="btn btn-sm btn-danger" onClick={() => f.id && recipeApi.deleteFermentable(externalId, f.id).then(setRecipe)}>🗑️</button>
                  </div>
                </div>
              )
            ))}
          </div>
          {showAddFerm && !editingFermentable ? (
            <AddIngredientForm 
              category="fermentable"
              onAdd={(id, qty) => handleAddFermentable(id, qty)} 
              onCancel={() => setShowAddFerm(false)} 
            />
          ) : (
            !editingFermentable && <button className="add-btn" onClick={() => setShowAddFerm(true)}>+ {t('recipe.form.add_fermentable')}</button>
          )}
        </section>

        {/* HOPS */}
        <section className="detail-section">
          <h3>🌿 {t('inventory.categories.hops')}</h3>
          <div className="ingredient-list">
            {recipe.hops.map(h => (
              editingHop?.id === h.id ? (
                <AddHopForm 
                  key={h.id}
                  initialValues={{
                    id: h.hopId,
                    name: inventory.hops[h.hopId] || '...',
                    amount: h.amount,
                    phase: h.phase,
                    duration: h.duration
                  }}
                  onAdd={(id, qty, phase, dur) => h.id && handleUpdateHop(h.id, id, qty, phase, dur)} 
                  onCancel={() => setEditingHop(null)} 
                />
              ) : (
                <div key={h.id} className="ingredient-item-card">
                  <span className="ing-name">{inventory.hops[h.hopId] || '...'}</span>
                  <div className="ing-details">
                    <div className="ing-detail-item">
                      <span className="ing-label">{t('recipe.form.amount')}:</span>
                      <span>{h.amount} g</span>
                    </div>
                    <div className="ing-detail-item">
                      <span className="ing-label">{t('recipe.form.phase')}:</span>
                      <span className="phase-badge">{h.phase}</span>
                    </div>
                    <div className="ing-detail-item">
                      <span className="ing-label">{t('recipe.form.duration')}:</span>
                      <span>{h.duration} min</span>
                    </div>
                  </div>
                  <div className="ing-action">
                    <button className="btn btn-sm btn-outline" onClick={() => setEditingHop(h)}>Modifier</button>
                    <button className="btn btn-sm btn-danger" onClick={() => h.id && recipeApi.deleteHop(externalId, h.id).then(setRecipe)}>🗑️</button>
                  </div>
                </div>
              )
            ))}
          </div>
          {showAddHop && !editingHop ? (
            <AddHopForm 
              onAdd={(id, qty, phase, dur) => handleAddHop(id, qty, phase, dur)} 
              onCancel={() => setShowAddHop(false)} 
            />
          ) : (
            !editingHop && <button className="add-btn" onClick={() => setShowAddHop(true)}>+ {t('recipe.form.add_hop')}</button>
          )}
        </section>

                      {/* MASH STEPS */}
        <section className="detail-section">
          <h3>🔥 {t('recipe.form.mash_steps')}</h3>
          <div className="ingredient-list">
            {recipe.mashSteps.map(m => (
              editingMashStep?.id === m.id ? (
                <AddMashStepForm
                  key={m.id}
                  initialValues={{ id: m.id!, name: m.name, temperature: m.temperature, duration: m.duration }}
                  onAdd={(name, temp, dur) => m.id && handleUpdateMashStep(m.id, name, temp, dur)}
                  onCancel={() => setEditingMashStep(null)}
                />
              ) : (
                <div key={m.id} className="ingredient-item-card">
                  <span className="ing-name">{m.name}</span>
                  <div className="ing-details">
                    <div className="ing-detail-item">
                      <span className="ing-label">Temp:</span>
                      <span>{m.temperature} °C</span>
                    </div>
                    <div className="ing-detail-item">
                      <span className="ing-label">Durée:</span>
                      <span>{m.duration} min</span>
                    </div>
                  </div>
                  <div className="ing-action">
                    <button className="btn btn-sm btn-outline" onClick={() => setEditingMashStep(m)}>Modifier</button>
                    <button className="btn btn-sm btn-danger" onClick={() => m.id && recipeApi.deleteMashStep(externalId, m.id).then(setRecipe)}>🗑️</button>
                  </div>
                </div>
              )
            ))}
          </div>
          {showAddMashStep && !editingMashStep ? (
            <AddMashStepForm 
              onAdd={(name, temp, dur) => handleAddMashStep(name, temp, dur)} 
              onCancel={() => setShowAddMashStep(false)} 
            />
          ) : (
            !editingMashStep && <button className="add-btn" onClick={() => setShowAddMashStep(true)}>+ Ajouter un palier</button>
          )}
        </section>

        {/* YEAST */}
        <section className="detail-section">
          <h3>🧪 {t('inventory.categories.yeasts')}</h3>
          <div className="ingredient-list">
            {recipe.yeast && (
              showAddYeast ? (
                <AddIngredientForm 
                  category="yeast"
                  initialValues={{
                    id: recipe.yeast.yeastId,
                    name: inventory.yeasts[recipe.yeast.yeastId] || '...',
                    amount: recipe.yeast.amount
                  }}
                  onAdd={(id, qty) => handleUpdateYeast(id, qty)} 
                  onCancel={() => setShowAddYeast(false)} 
                />
              ) : (
                <div className="ingredient-item-card">
                  <span className="ing-name">{inventory.yeasts[recipe.yeast.yeastId] || '...'}</span>
                  <div className="ing-details">
                    <div className="ing-detail-item">
                      <span className="ing-label">{t('recipe.form.amount')}:</span>
                      <span>{recipe.yeast.amount} g</span>
                    </div>
                  </div>
                  <div className="ing-action">
                    <button className="btn btn-sm btn-outline" onClick={() => setShowAddYeast(true)}>Modifier</button>
                  </div>
                </div>
              )
            )}
          </div>
          {!recipe.yeast && !showAddYeast && (
            <button className="add-btn" onClick={() => setShowAddYeast(true)}>+ {t('recipe.form.add_yeast')}</button>
          )}
          {showAddYeast && !recipe.yeast && (
            <AddIngredientForm 
              category="yeast"
              onAdd={(id, qty) => handleUpdateYeast(id, qty)} 
              onCancel={() => setShowAddYeast(false)} 
            />
          )}
        </section>
      </div>
    </div>
  );
};

const AddIngredientForm: React.FC<{ 
  category: 'fermentable' | 'yeast', 
  initialValues?: { id: number, name: string, amount: number },
  onAdd: (id: number, qty: number) => void, 
  onCancel: () => void 
}> = ({ category, initialValues, onAdd, onCancel }) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(initialValues || null);
  const [qty, setQty] = useState(initialValues?.amount || (category === 'fermentable' ? 1000 : 11));
  const { t } = useTranslation();

  const fetchFn = category === 'fermentable' 
    ? inventoryApi.getFermentables 
    : inventoryApi.getYeasts;

  const renderItem = (item: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>{category === 'fermentable' ? getFermentableIcon(item.type) : getYeastIcon(item.type)}</span>
      <span>{item.name}</span>
    </div>
  );

  return (
    <div className="ingredient-add-form">
      <div className="form-row">
        <div className="form-group">
          <SearchableSelect 
            label={category === 'fermentable' ? t('inventory.categories.fermentables') : t('inventory.categories.yeasts')}
            fetchFn={fetchFn}
            initialItem={selectedItem}
            onSelect={setSelectedItem}
            renderItem={renderItem}
            placeholder={category === 'fermentable' ? "Choisir un malt..." : "Choisir une levure..."}
          />
        </div>
        <div className="form-group">
          <label>Quantité (g)</label>
          <input 
            type="number" 
            className="input-styled"
            value={qty} 
            onChange={e => setQty(Number(e.target.value))} 
          />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-outline" onClick={onCancel}>
          Annuler
        </button>
        <button 
          className="btn btn-primary" 
          disabled={!selectedItem}
          onClick={() => selectedItem && onAdd(selectedItem.id, qty)}
        >
          {initialValues ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </div>
  );
};

const AddHopForm: React.FC<{ 
  initialValues?: { id: number, name: string, amount: number, phase: string, duration: number },
  onAdd: (id: number, qty: number, phase: string, dur: number) => void, 
  onCancel: () => void 
}> = ({ initialValues, onAdd, onCancel }) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(initialValues || null);
  const [qty, setQty] = useState(initialValues?.amount || 20);
  const [phase, setPhase] = useState(initialValues?.phase || 'BOIL');
  const [dur, setDur] = useState(initialValues?.duration || 60);
  const { t } = useTranslation();

  const renderItem = (item: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>🌿</span>
      <span>{item.name}</span>
    </div>
  );

  return (
    <div className="ingredient-add-form">
      <div className="form-row">
        <div className="form-group">
          <SearchableSelect 
            label={t('inventory.categories.hops')}
            fetchFn={inventoryApi.getHops}
            initialItem={selectedItem}
            onSelect={setSelectedItem}
            renderItem={renderItem}
            placeholder="Choisir un houblon..."
          />
        </div>
        <div className="form-group">
          <label>Quantité (g)</label>
          <input 
            type="number" 
            className="input-styled"
            value={qty} 
            onChange={e => setQty(Number(e.target.value))} 
          />
        </div>
      </div>
      <div className="form-row" style={{ marginTop: '16px' }}>
        <div className="form-group">
          <label>Phase</label>
          <select 
            className="input-styled"
            value={phase} 
            onChange={e => setPhase(e.target.value)}
          >
            <option value="BOIL">BOIL</option>
            <option value="HOPSTAND">HOPSTAND</option>
            <option value="DRY_HOP">DRY_HOP</option>
          </select>
        </div>
        <div className="form-group">
          <label>Durée (min)</label>
          <input 
            type="number" 
            className="input-styled"
            value={dur} 
            onChange={e => setDur(Number(e.target.value))} 
          />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-outline" onClick={onCancel}>
          Annuler
        </button>
        <button 
          className="btn btn-primary" 
          disabled={!selectedItem}
          onClick={() => selectedItem && onAdd(selectedItem.id, qty, phase, dur)}
        >
          {initialValues ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </div>
  );
};

const AddMashStepForm: React.FC<{ 
  initialValues?: { id: number, name: string, temperature: number, duration: number },
  onAdd: (name: string, temp: number, dur: number) => void, 
  onCancel: () => void 
}> = ({ initialValues, onAdd, onCancel }) => {
  const [name, setName] = useState(initialValues?.name || 'Saccharification');
  const [temp, setTemp] = useState(initialValues?.temperature || 65);
  const [dur, setDur] = useState(initialValues?.duration || 60);

  return (
    <div className="ingredient-add-form">
      <div className="form-row">
        <div className="form-group">
          <label>Nom</label>
          <input 
            type="text" 
            className="input-styled"
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
        </div>
      </div>
      <div className="form-row" style={{ marginTop: '16px' }}>
        <div className="form-group">
          <label>Température (°C)</label>
          <input 
            type="number" 
            className="input-styled"
            value={temp} 
            onChange={e => setTemp(Number(e.target.value))} 
          />
        </div>
        <div className="form-group">
          <label>Durée (min)</label>
          <input 
            type="number" 
            className="input-styled"
            value={dur} 
            onChange={e => setDur(Number(e.target.value))} 
          />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary" onClick={() => onAdd(name, temp, dur)}>
          {initialValues ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
