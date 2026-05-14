// Utilitaire pour la couleur EBC (approximative)
export const getEbcColor = (ebc?: number) => {
  if (!ebc) return '#ccc';
  if (ebc < 10) return '#F3F999';
  if (ebc < 20) return '#E5E100';
  if (ebc < 40) return '#C47200';
  if (ebc < 60) return '#723400';
  return '#311000';
};
