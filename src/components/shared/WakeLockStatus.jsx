import React from 'react';

function WakeLockStatus({ isSupported, isActive, error }) {
  if (!isSupported) {
    return (
      <div className="fixed bottom-4 left-4 text-xs text-text-muted bg-white/80 px-3 py-2 rounded">
        Wake Lock not supported
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 left-4 text-xs text-red-600 bg-white/80 px-3 py-2 rounded">
        Wake Lock error
      </div>
    );
  }

  return null;
}

export default WakeLockStatus;
