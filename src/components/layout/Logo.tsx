import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTextOnMobile?: boolean;
  variant?: 'default' | 'white';
}

export default function Logo({ 
  className = '', 
  size = 'md',
  showTextOnMobile = false,
  variant = 'default'
}: LogoProps) {
  const sizes = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-14'
  };

  return (
    <Link 
      to="/" 
      className={cn(
        'flex items-center gap-2 transition-opacity hover:opacity-90',
        className
      )}
      aria-label="Poramorshok - Home"
    >
      <div className={cn('relative flex-shrink-0', sizes[size])}>
        <img 
          src="/logo.svg" 
          alt=""
          className={cn(
            'h-full w-auto',
            variant === 'white' && 'brightness-0 invert'
          )}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}