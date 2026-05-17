import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// Mock des services API pour éviter les appels réseau pendant les tests
vi.mock('./services/api', () => ({
  recipeApi: {
    getRecipes: vi.fn(() => Promise.resolve([])),
    getRecipe: vi.fn(() => Promise.resolve({
      name: 'Test Recipe',
      batchVolume: 20,
      efficiency: 75,
      fermentables: [],
      hops: [],
    })),
  },
  inventoryApi: {
    getFermentables: vi.fn(() => Promise.resolve({ content: [{ id: 1, name: 'Pilsner', type: 'GRAIN', colorEbc: 3 }] })),
    getFermentableById: vi.fn(() => Promise.resolve({ id: 1, name: 'Pilsner', type: 'GRAIN', colorEbc: 3 })),
    getHops: vi.fn(() => Promise.resolve({ content: [] })),
    getYeasts: vi.fn(() => Promise.resolve({ content: [] })),
  },
  styleApi: {
    getStyles: vi.fn(() => Promise.resolve({ content: [] })),
    getStyleById: vi.fn(() => Promise.resolve({ id: 1, name: 'Ordinary Bitter' })),
  }
}));

test('full app rendering and navigation including details', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );

  // Dashboard
  expect(screen.getByText(/Welcome to Brassam Helper/i)).toBeDefined();

  // Navigation vers l'Inventaire
  const inventoryLink = screen.getByRole('link', { name: /inventory/i });
  fireEvent.click(inventoryLink);
  await waitFor(() => expect(window.location.pathname).toBe('/inventory'));

  // Clic sur un item pour voir le détail - Utilisation d'une regex pour être plus flexible
  const pilsnerItem = await screen.findByText(/Pilsner/i);
  fireEvent.click(pilsnerItem);
  await waitFor(() => expect(window.location.pathname).toBe('/inventory/fermentable/1'));

  // Vérifie qu'on est bien sur la fiche détail (bouton retour présent)
  const backButton = await screen.findByText(/back/i);
  fireEvent.click(backButton);
  await waitFor(() => expect(window.location.pathname).toBe('/inventory'));
});
