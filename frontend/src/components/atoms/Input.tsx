import React, { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant = 'default', fullWidth = false, ...props }, ref) => {
    const baseClasses = 'px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      default: 'border-gray-300 focus:border-[#083A31] focus:ring-[#083A31] text-gray-900',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500 text-gray-900'
    };
    
    const widthClasses = fullWidth ? 'w-full' : '';
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${widthClasses} ${className}`.trim();
    
    return (
      <input
        ref={ref}
        className={classes}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;