import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children, onClick, type = 'button', variant = 'primary',
  size = 'md', loading = false, disabled = false, icon: Icon, className = '',
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0C0C0E]';

  const variants = {
    primary:   'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500 shadow-glow-orange-sm hover:shadow-glow-orange',
    secondary: 'bg-white/10 hover:bg-white/[0.15] text-white border border-white/10 hover:border-white/20 focus:ring-white/20',
    ghost:     'hover:bg-white/5 text-[#888899] hover:text-white focus:ring-white/10',
    danger:    'bg-red-500/90 hover:bg-red-500 text-white focus:ring-red-500',
    outline:   'border border-brand-500/50 text-brand-400 hover:bg-brand-500/10 focus:ring-brand-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-sm',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
      {children}
    </button>
  );
}
