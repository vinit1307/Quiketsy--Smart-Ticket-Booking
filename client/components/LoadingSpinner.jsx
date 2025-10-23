import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  const containerClass = fullPage 
    ? "min-h-screen flex items-center justify-center" 
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008CFF]"></div>
    </div>
  );
};

export default LoadingSpinner;