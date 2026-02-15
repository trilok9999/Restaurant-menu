import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import * as AuthContext from '../../../contexts/AuthContext';

// Mock the useAuth hook
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  const renderProtectedRoute = () => {
    return render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );
  };

  it('shows loading state while authenticating', () => {
    AuthContext.useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    renderProtectedRoute();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    AuthContext.useAuth.mockReturnValue({
      user: { id: '1', email: 'admin@test.com' },
      loading: false,
    });

    renderProtectedRoute();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    AuthContext.useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    renderProtectedRoute();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('does not show children during loading', () => {
    AuthContext.useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    renderProtectedRoute();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
