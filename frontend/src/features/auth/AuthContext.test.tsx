import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should initialize with null user and token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login and save to localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const authData = { token: 'fake-token', username: 'testuser', email: 'test@example.com' };

    act(() => {
      result.current.login(authData);
    });

    expect(result.current.user).toEqual({ username: 'testuser', email: 'test@example.com' });
    expect(result.current.token).toBe('fake-token');
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('should logout and clear localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const authData = { token: 'fake-token', username: 'testuser', email: 'test@example.com' };

    act(() => {
      result.current.login(authData);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should load user from localStorage on init', () => {
    localStorage.setItem('token', 'saved-token');
    localStorage.setItem('user', JSON.stringify({ username: 'saved-user', email: 'saved@example.com' }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.token).toBe('saved-token');
    expect(result.current.user?.username).toBe('saved-user');
  });
});
