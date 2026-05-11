import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Fermentables from '../Fermentables/Fermentables';
import Hops from '../Hops/Hops';
import Yeasts from '../Yeasts/Yeasts';
import InventoryDetail from '../InventoryDetail/InventoryDetail';
import './Inventory.css';

type Category = 'fermentables' | 'hops' | 'yeasts';

const Inventory: React.FC = () => {
  const [category, setCategory] = useState<Category>('fermentables');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const { t } = useTranslation();

  if (selectedItemId !== null) {
    return (
      <InventoryDetail 
        id={selectedItemId} 
        category={category} 
        onBack={() => setSelectedItemId(null)} 
      />
    );
  }

  return (
    <div className="inventory-screen">
      <div className="category-tabs">
        <button 
          className={category === 'fermentables' ? 'active' : ''} 
          onClick={() => setCategory('fermentables')}
        >
          {t('inventory.categories.fermentables')}
        </button>
        <button 
          className={category === 'hops' ? 'active' : ''} 
          onClick={() => setCategory('hops')}
        >
          {t('inventory.categories.hops')}
        </button>
        <button 
          className={category === 'yeasts' ? 'active' : ''} 
          onClick={() => setCategory('yeasts')}
        >
          {t('inventory.categories.yeasts')}
        </button>
      </div>

      <div className="category-content">
        {category === 'fermentables' && <Fermentables onSelectItem={setSelectedItemId} />}
        {category === 'hops' && <Hops onSelectItem={setSelectedItemId} />}
        {category === 'yeasts' && <Yeasts onSelectItem={setSelectedItemId} />}
      </div>
    </div>
  );
};

export default Inventory;
