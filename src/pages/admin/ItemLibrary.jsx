import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import ItemForm from '../../components/admin/ItemForm';

function ItemLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const categories = ['all', 'appetizer', 'main', 'side', 'dessert', 'beverage'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData) => {
    const { error } = await supabase.from('menu_items').insert([itemData]);

    if (error) throw error;

    await fetchItems();
    setShowForm(false);
  };

  const handleUpdateItem = async (itemData) => {
    const { error } = await supabase
      .from('menu_items')
      .update(itemData)
      .eq('id', editingItem.id);

    if (error) throw error;

    await fetchItems();
    setEditingItem(null);
    setShowForm(false);
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from('menu_items').delete().eq('id', itemId);

    if (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
      return;
    }

    await fetchItems();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredItems = filterCategory === 'all'
    ? items
    : items.filter((item) => item.category === filterCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-muted">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-display text-3xl text-gray-800">Item Library</h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/daily')}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Daily Menu
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
        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            + Add Item
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-display mb-6">
                {editingItem ? 'Edit Item' : 'Create New Item'}
              </h2>
              <ItemForm
                item={editingItem}
                onSave={editingItem ? handleUpdateItem : handleCreateItem}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No items found. Create your first item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <span className="text-primary font-semibold">
                      ${item.base_price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 uppercase mb-2">{item.category}</p>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.dietary_tags && item.dietary_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.dietary_tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowForm(true);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemLibrary;
