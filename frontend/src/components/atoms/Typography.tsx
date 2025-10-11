import { ReactNode, createElement } from 'react';
import clsx from 'clsx';

interface TypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'subtitle';
  className?: string;
  color?: 'primary' | 'secondary' | 'muted' | 'white';
}

export const Typography = ({ 
  children, 
  variant = 'body', 
  className,
  color = 'primary'
}: TypographyProps) => {
  const variants = {
    h1: 'text-4xl lg:text-5xl font-bold leading-tight',
    h2: 'text-3xl lg:text-4xl font-bold leading-tight',
    h3: 'text-2xl lg:text-3xl font-semibold leading-tight',
    h4: 'text-xl lg:text-2xl font-semibold leading-tight',
    body: 'text-base leading-relaxed',
    subtitle: 'text-lg leading-relaxed',
    caption: 'text-sm leading-normal',
  };

  const colors = {
    primary: 'text-neutral-dark',
    secondary: 'text-clean-secondary',
    muted: 'text-gray-600',
    white: 'text-white',
  };

  const tag = variant.startsWith('h') ? variant : 'p';

  return createElement(
    tag,
    {
      className: clsx(
        variants[variant],
        colors[color],
        className
      )
    },
    children
  );
};