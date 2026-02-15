import { useState, useEffect } from 'react';

export function useDailyMenu() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = async () => {
    // This will be implemented in Phase 2 with Supabase integration
    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return { menu, loading, error, refetch: fetchMenu };
}
