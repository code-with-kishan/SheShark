import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: React.FC<CardProps> = ({ children, className, delay = 0, ...props }) => (
  <div className={cn("glass rounded-2xl sm:rounded-3xl p-4 sm:p-6", className)} {...props}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: LucideIcon;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  loading, 
  className, 
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg'
  };

  return (
    <button 
      className={cn(variants[variant], "flex items-center justify-center gap-2 disabled:opacity-50", className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon && <Icon size={20} />}
      {children}
    </button>
  );
};
 
