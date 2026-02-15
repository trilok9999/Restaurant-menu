import React from 'react';

function DietaryBadge({ tag }) {
  const colorMap = {
    Veg: 'bg-green-100 text-green-800',
    Vegan: 'bg-emerald-100 text-emerald-800',
    Spicy: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[tag] || 'bg-gray-100 text-gray-800'}`}>
      {tag}
    </span>
  );
}

export default DietaryBadge;
