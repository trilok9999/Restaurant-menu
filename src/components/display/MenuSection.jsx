import React from 'react';

function MenuSection({ category, items }) {
  return (
    <div className="mb-12">
      <h2 className="font-display text-3xl mb-6 text-center">{category}</h2>
      {/* Items will be rendered here in Phase 3 */}
    </div>
  );
}

export default MenuSection;
