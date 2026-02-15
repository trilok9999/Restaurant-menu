import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DietaryBadge from '../DietaryBadge';

describe('DietaryBadge', () => {
  it('renders Veg badge correctly', () => {
    render(<DietaryBadge tag="Veg" />);
    expect(screen.getByText('Veg')).toBeInTheDocument();
  });

  it('renders Vegan badge correctly', () => {
    render(<DietaryBadge tag="Vegan" />);
    expect(screen.getByText('Vegan')).toBeInTheDocument();
  });

  it('renders Spicy badge correctly', () => {
    render(<DietaryBadge tag="Spicy" />);
    expect(screen.getByText('Spicy')).toBeInTheDocument();
  });

  it('renders unknown tag with default styling', () => {
    const { container } = render(<DietaryBadge tag="unknown" />);
    const badge = screen.getByText('unknown');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('applies correct color classes for Veg', () => {
    const { container } = render(<DietaryBadge tag="Veg" />);
    const badge = screen.getByText('Veg');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('applies correct color classes for Vegan', () => {
    const { container } = render(<DietaryBadge tag="Vegan" />);
    const badge = screen.getByText('Vegan');
    expect(badge).toHaveClass('bg-emerald-100', 'text-emerald-800');
  });

  it('applies correct color classes for Spicy', () => {
    const { container } = render(<DietaryBadge tag="Spicy" />);
    const badge = screen.getByText('Spicy');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });
});
