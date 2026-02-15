import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DailyBuilder from '../../components/admin/DailyBuilder';

function DailyMenu() {
  const [selectedDate, setSelectedDate] = useState('');
  const [menuStatus, setMenuStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      checkMenuStatus();
    }
  }, [selectedDate]);

  const checkMenuStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_menus')
        .select('*')
        .eq('menu_date', selectedDate)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setMenuStatus(data);
    } catch (error) {
      console.error('Error checking menu status:', error);
    }
  };

  const handleSaveMenu = async (selectedItems) => {
    setLoading(true);
    setSaveMessage('');

    try {
      // First, delete existing daily menu items for this date
      await supabase
        .from('daily_menu_items')
        .delete()
        .eq('menu_date', selectedDate);

      // Create or update the daily_menus record
      const { data: menuData, error: menuError } = await supabase
        .from('daily_menus')
        .upsert(
          {
            menu_date: selectedDate,
            is_published: menuStatus?.is_published || false,
          },
          { onConflict: 'menu_date' }
        )
        .select()
        .single();

      if (menuError) throw menuError;

      // Insert new daily menu items
      if (selectedItems.length > 0) {
        const dailyMenuItems = selectedItems.map((item, index) => ({
          menu_date: selectedDate,
          item_id: item.id,
          daily_price: item.daily_price,
          is_special: item.is_special || false,
          special_description: item.special_description || null,
          display_order: index,
        }));

        const { error: itemsError } = await supabase
          .from('daily_menu_items')
          .insert(dailyMenuItems);

        if (itemsError) throw itemsError;
      }

      setSaveMessage('Menu saved successfully!');
      await checkMenuStatus();

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving menu:', error);
      setSaveMessage('Error saving menu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!menuStatus) {
      setSaveMessage('Please save the menu first before publishing');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('daily_menus')
        .update({ is_published: !menuStatus.is_published })
        .eq('menu_date', selectedDate);

      if (error) throw error;

      setSaveMessage(
        !menuStatus.is_published
          ? 'Menu published successfully!'
          : 'Menu unpublished successfully!'
      );
      await checkMenuStatus();

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      setSaveMessage('Error updating publish status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-display text-3xl text-gray-800">Daily Menu Builder</h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/items')}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Item Library
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Selection and Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <label htmlFor="menu-date" className="text-sm font-medium text-gray-700">
                Menu Date:
              </label>
              <input
                id="menu-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-3">
              {menuStatus && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    menuStatus.is_published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {menuStatus.is_published ? 'Published' : 'Draft'}
                </span>
              )}
              <button
                onClick={handlePublishToggle}
                disabled={loading || !menuStatus}
                className={`px-4 py-2 rounded-md text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  menuStatus?.is_published
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading
                  ? 'Processing...'
                  : menuStatus?.is_published
                  ? 'Unpublish Menu'
                  : 'Publish Menu'}
              </button>
            </div>
          </div>

          {saveMessage && (
            <div
              className={`mt-4 p-3 rounded-md ${
                saveMessage.includes('Error')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {saveMessage}
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Instructions:</strong> Select items from the library, set daily prices, mark
              chef's specials, and drag to reorder. Save the menu, then publish it to make it visible
              on the display screen.
            </p>
          </div>
        </div>

        {/* Daily Builder Component */}
        {selectedDate && <DailyBuilder date={selectedDate} onSave={handleSaveMenu} />}
      </div>
    </div>
  );
}

export default DailyMenu;
