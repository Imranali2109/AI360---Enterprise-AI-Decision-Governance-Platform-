import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-[#1E1E28]" />
        <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full bg-brand-500/10" />
      </div>
      <p className="text-xs text-[#555570]">{message}</p>
    </div>
  );
}
