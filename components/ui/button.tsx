import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          {
            // Variants
            'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-850 shadow-sm': variant === 'primary',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300': variant === 'secondary',
            'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700': variant === 'outline',
            'hover:bg-slate-100 text-slate-600 hover:text-slate-900': variant === 'ghost',
            'bg-red-650 text-white hover:bg-red-750': variant === 'danger',
            
            // Sizes
            'h-9 px-3.5 text-xs': size === 'sm',
            'h-10 px-5 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
