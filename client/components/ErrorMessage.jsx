import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading events</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;