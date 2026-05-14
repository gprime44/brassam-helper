import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Fermentables from '../Fermentables/Fermentables';
import Hops from '../Hops/Hops';
import Yeasts from '../Yeasts/Yeasts';
import InventoryDetail from '../InventoryDetail/InventoryDetail';
import './Inventory.css';

type Category = 'fermentable' | 'hop' | 'yeast';

const Inventory: React.FC = () => {
  const [category, setCategory] = useState<Category>('fermentable');
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
          className={category === 'fermentable' ? 'active' : ''} 
          onClick={() => setCategory('fermentable')}
        >
          {t('inventory.categories.fermentables')}
        </button>
        <button 
          className={category === 'hop' ? 'active' : ''} 
          onClick={() => setCategory('hop')}
        >
          {t('inventory.categories.hops')}
        </button>
        <button 
          className={category === 'yeast' ? 'active' : ''} 
          onClick={() => setCategory('yeast')}
        >
          {t('inventory.categories.yeasts')}
        </button>
      </div>

      <div className="category-content">
        {category === 'fermentable' && <Fermentables onSelectItem={setSelectedItemId} />}
        {category === 'hop' && <Hops onSelectItem={setSelectedItemId} />}
        {category === 'yeast' && <Yeasts onSelectItem={setSelectedItemId} />}
      </div>
    </div>
  );
};

export default Inventory;
