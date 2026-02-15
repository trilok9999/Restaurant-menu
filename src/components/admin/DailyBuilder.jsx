import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function DailyBuilder({ date, onSave }) {
  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'appetizer', 'main', 'side', 'dessert', 'beverage'];

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all available items from library
      const { data: libraryItems, error: libraryError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (libraryError) throw libraryError;

      // Fetch existing daily menu items for this date
      const { data: dailyItems, error: dailyError } = await supabase
        .from('daily_menu_items')
        .select(`
          *,
          menu_items (*)
        `)
        .eq('menu_date', date)
        .order('display_order', { ascending: true });

      if (dailyError) throw dailyError;

      setAvailableItems(libraryItems || []);

      // Transform daily items to include item details
      const transformedItems = (dailyItems || []).map((di) => ({
        daily_menu_item_id: di.id,
        ...di.menu_items,
        daily_price: di.daily_price,
        is_special: di.is_special,
        special_description: di.special_description,
      }));

      setSelectedItems(transformedItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (item) => {
    // Check if item already added
    if (selectedItems.some((si) => si.id === item.id)) {
      alert('This item is already in the daily menu');
      return;
    }

    setSelectedItems((prev) => [
      ...prev,
      {
        ...item,
        daily_price: item.base_price,
        is_special: false,
        special_description: null,
      },
    ]);
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const items = [...selectedItems];
    const draggedItemData = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemData);

    setDraggedItem(index);
    setSelectedItems(items);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleItemChange = (index, field, value) => {
    setSelectedItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = () => {
    onSave(selectedItems);
  };

  const filteredAvailableItems = availableItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Available Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Available Items</h3>

        {/* Search and Filter */}
        <div className="mb-4 space-y-3">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  filterCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredAvailableItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items found</p>
          ) : (
            filteredAvailableItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category} - ${item.base_price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleAddItem(item)}
                  className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors"
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Items for Daily Menu */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Daily Menu ({selectedItems.length} items)</h3>
          <button
            onClick={handleSave}
            disabled={selectedItems.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Menu
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">Drag items to reorder</p>

        {/* Selected Items List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {selectedItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items selected. Add items from the left panel.</p>
          ) : (
            selectedItems.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-4 bg-gray-50 rounded-md cursor-move border-2 transition-all ${
                  draggedItem === index ? 'border-primary opacity-50' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Daily Price ($)</label>
                    <input
                      type="number"
                      value={item.daily_price}
                      onChange={(e) => handleItemChange(index, 'daily_price', parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.is_special || false}
                        onChange={(e) => handleItemChange(index, 'is_special', e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-700">Chef's Special</span>
                    </label>
                  </div>
                </div>

                {item.is_special && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Special Description</label>
                    <textarea
                      value={item.special_description || ''}
                      onChange={(e) => handleItemChange(index, 'special_description', e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="What makes this special today?"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyBuilder;
