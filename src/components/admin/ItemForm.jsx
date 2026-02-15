import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function ItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'appetizer',
    base_price: '',
    description: '',
    dietary_tags: [],
    is_available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['appetizer', 'main', 'side', 'dessert', 'beverage'];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'];

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'appetizer',
        base_price: item.base_price || '',
        description: item.description || '',
        dietary_tags: item.dietary_tags || [],
        is_available: item.is_available ?? true,
      });
      if (item.image_url) {
        setImagePreview(item.image_url);
      }
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDietaryTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      dietary_tags: prev.dietary_tags.includes(tag)
        ? prev.dietary_tags.filter((t) => t !== tag)
        : [...prev.dietary_tags, tag],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `menu-items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let image_url = item?.image_url || null;

      // Upload new image if selected
      if (imageFile) {
        image_url = await uploadImage();
      }

      const itemData = {
        ...formData,
        base_price: parseFloat(formData.base_price),
        image_url,
      };

      await onSave(itemData);
    } catch (err) {
      console.error('Error saving item:', err);
      setError(err.message || 'Failed to save item');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Item Name *
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., Caesar Salad"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Base Price */}
      <div>
        <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-1">
          Base Price ($) *
        </label>
        <input
          id="base_price"
          type="number"
          name="base_price"
          value={formData.base_price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="12.99"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Brief description of the item..."
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
        {imagePreview && (
          <div className="mb-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md border border-gray-300"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
      </div>

      {/* Dietary Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Tags</label>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleDietaryTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                formData.dietary_tags.includes(tag)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Is Available */}
      <div className="flex items-center">
        <input
          id="is_available"
          type="checkbox"
          name="is_available"
          checked={formData.is_available}
          onChange={handleChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
          Available in item library
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ItemForm;
