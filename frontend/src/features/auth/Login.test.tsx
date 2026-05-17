import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from './AuthContext';
import { authApi } from '../../services/api';

vi.mock('../../services/api', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

const renderLogin = () => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/mot de passe/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeDefined();
  });

  it('should call login API and redirect on success', async () => {
    const mockAuthResponse = { token: 'token123', username: 'tester', email: 'test@test.com' };
    vi.mocked(authApi.login).mockResolvedValue(mockAuthResponse);

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });
  });

  it('should show error message on login failure', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Unauthorized'));

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText(/email ou mot de passe incorrect/i)).toBeDefined();
    });
  });
});
