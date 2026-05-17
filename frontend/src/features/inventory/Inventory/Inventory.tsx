import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Fermentables from '../Fermentables/Fermentables';
import Hops from '../Hops/Hops';
import Yeasts from '../Yeasts/Yeasts';
import './Inventory.css';

type Category = 'fermentable' | 'hop' | 'yeast';

const Inventory: React.FC = () => {
  const [category, setCategory] = useState<Category>('fermentable');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelectItem = (id: number) => {
    navigate(`/inventory/${category}/${id}`);
  };

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
        {category === 'fermentable' && <Fermentables onSelectItem={handleSelectItem} />}
        {category === 'hop' && <Hops onSelectItem={handleSelectItem} />}
        {category === 'yeast' && <Yeasts onSelectItem={handleSelectItem} />}
      </div>
    </div>
  );
};

export default Inventory;
