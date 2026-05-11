import type { FermentableType, YeastType } from '../services/api';

export const getFermentableIcon = (type: FermentableType): string => {
  switch (type) {
    case 'GRAIN': return '🌾';
    case 'SUGAR': return '🍬';
    case 'EXTRACT': return '⚗️';
    case 'DRY_EXTRACT': return '📦';
    case 'ADJUNCT': return '🌿';
    default: return '❓';
  }
};

export const getYeastIcon = (type: YeastType): string => {
  switch (type) {
    case 'ALE': return '🍺';
    case 'LAGER': return '❄️';
    case 'KVEIK': return '🔥';
    case 'BACTERIA': return '🦠';
    case 'BRETT': return '🐑';
    case 'WINE': return '🍷';
    default: return '🧪';
  }
};
