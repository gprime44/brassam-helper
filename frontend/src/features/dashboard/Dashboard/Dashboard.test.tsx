import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../../auth/AuthContext';
import { recipeApi } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  recipeApi: {
    getRecipes: vi.fn(),
  },
  inventoryApi: {
    getFermentables: vi.fn(),
    getHops: vi.fn(),
    getYeasts: vi.fn(),
  },
}));

const renderDashboard = () => {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('user', JSON.stringify({ username: 'Tester', email: 'test@test.com' }));
    localStorage.setItem('token', 'fake-token');
  });

  it('should display the 3 most recent recipes', async () => {
    const mockRecipes = [
      { externalId: '1', name: 'Recent 1', abv: 5.0, ibu: 30, ebc: 10, batchVolume: 20 },
      { externalId: '2', name: 'Recent 2', abv: 6.0, ibu: 40, ebc: 20, batchVolume: 20 },
      { externalId: '3', name: 'Recent 3', abv: 7.0, ibu: 50, ebc: 30, batchVolume: 20 },
      { externalId: '4', name: 'Oldest', abv: 4.0, ibu: 20, ebc: 40, batchVolume: 20 },
    ];
    vi.mocked(recipeApi.getRecipes).mockResolvedValue(mockRecipes as any);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Recent 1')).toBeDefined();
      expect(screen.getByText('Recent 2')).toBeDefined();
      expect(screen.getByText('Recent 3')).toBeDefined();
      expect(screen.queryByText('Oldest')).toBeNull();
    });
  });

  it('should display empty state when no recipes', async () => {
    vi.mocked(recipeApi.getRecipes).mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/dashboard.no_recipes/i)).toBeDefined();
      expect(screen.getAllByRole('link', { name: /dashboard.actions.new_recipe/i }).length).toBeGreaterThan(0);
    });
  });
});
