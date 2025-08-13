import * as React from 'react';
import { cn } from '../../lib/utils';

type InputProps = React.ComponentProps<'input'> & {
  variant?: 'default' | 'ghost';
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    const baseStyles =
      'flex h-9 w-full rounded-md px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground md:text-sm';

    const variantStyles = {
      default:
        'border border-input bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      ghost:
        'border-none outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent',
    };

    return (
      <input
        type={type}
        className={cn(baseStyles, variantStyles[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
