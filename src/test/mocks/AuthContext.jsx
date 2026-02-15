import React from 'react';

export const mockAuthContext = {
  user: null,
  loading: false,
  signIn: vi.fn(),
  signOut: vi.fn(),
};

export const MockAuthProvider = ({ children, value = mockAuthContext }) => {
  return children;
};
