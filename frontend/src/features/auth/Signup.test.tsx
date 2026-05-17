import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Signup from './Signup';
import { AuthProvider } from './AuthContext';
import { authApi } from '../../services/api';

vi.mock('../../services/api', () => ({
  authApi: {
    signup: vi.fn(),
  },
}));

const renderSignup = () => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render signup form', () => {
    renderSignup();
    expect(screen.getByLabelText(/pseudo/i)).toBeDefined();
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/mot de passe/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /créer mon compte/i })).toBeDefined();
  });

  it('should call signup API and login on success', async () => {
    const mockAuthResponse = { token: 'token123', username: 'newuser', email: 'new@test.com' };
    vi.mocked(authApi.signup).mockResolvedValue(mockAuthResponse);

    renderSignup();

    fireEvent.change(screen.getByLabelText(/pseudo/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(authApi.signup).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@test.com',
        password: 'password123',
      });
    });
  });

  it('should show error message on signup failure', async () => {
    vi.mocked(authApi.signup).mockRejectedValue(new Error('Conflict'));

    renderSignup();

    fireEvent.change(screen.getByLabelText(/pseudo/i), { target: { value: 'existing' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(screen.getByText(/email ou le pseudo est peut-être déjà utilisé/i)).toBeDefined();
    });
  });
});
