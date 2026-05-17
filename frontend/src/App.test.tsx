import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { AuthProvider } from './features/auth/AuthContext';

// Mock simple pour les APIs
vi.mock('./services/api', () => ({
  authApi: {
    login: vi.fn(),
    signup: vi.fn(),
  },
  inventoryApi: {
    getFermentables: vi.fn().mockResolvedValue({ content: [], totalElements: 0 }),
    getHops: vi.fn().mockResolvedValue({ content: [], totalElements: 0 }),
    getYeasts: vi.fn().mockResolvedValue({ content: [], totalElements: 0 }),
  },
  styleApi: {
    getStyles: vi.fn().mockResolvedValue({ content: [], totalElements: 0 }),
  },
  recipeApi: {
    getRecipes: vi.fn().mockResolvedValue([]),
  }
}));

const renderWithRouter = (path: string) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('App Routing & ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should redirect to /login when accessing protected route without auth', async () => {
    renderWithRouter('/');
    
    await waitFor(() => {
      expect(screen.getByText(/heureux de vous revoir/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeDefined();
    });
  });

  it('should show dashboard when authenticated', async () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', JSON.stringify({ username: 'tester', email: 'test@test.com' }));

    renderWithRouter('/');
    
    await waitFor(() => {
      expect(screen.queryByText(/heureux de vous revoir/i)).toBeNull();
      // On vérifie qu'on voit un élément du dashboard (via i18n mocké ou texte brut)
      // Comme i18next n'est pas mocké ici, il affichera les clés ou le texte par défaut
      expect(screen.getByText(/dashboard.welcome_title/i)).toBeDefined();
    });
  });

  it('should render signup page', async () => {
    renderWithRouter('/signup');
    
    await waitFor(() => {
      expect(screen.getByText(/rejoindre brassam/i)).toBeDefined();
    });
  });
});
