import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle2, Ban, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionStatusCardProps {
  title: string;
  count: number;
  type: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  className?: string;
}

export default function SessionStatusCard({ title, count, type, className }: SessionStatusCardProps) {
  const icons = {
    upcoming: Calendar,
    completed: CheckCircle2,
    cancelled: Ban,
    pending: Clock
  };

  const colors = {
    upcoming: {
      icon: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      hover: 'hover:border-blue-200'
    },
    completed: {
      icon: 'text-green-500',
      bg: 'bg-green-50',
      border: 'border-green-100',
      hover: 'hover:border-green-200'
    },
    cancelled: {
      icon: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
      hover: 'hover:border-red-200'
    },
    pending: {
      icon: 'text-yellow-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
      hover: 'hover:border-yellow-200'
    }
  };

  const Icon = icons[type];

  return (
    <Card className={cn(
      'transition-all duration-200',
      colors[type].border,
      colors[type].hover,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('p-2 rounded-full', colors[type].bg)}>
          <Icon className={cn('h-4 w-4', colors[type].icon)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {type === 'upcoming' && 'Scheduled sessions'}
          {type === 'completed' && 'Successfully completed'}
          {type === 'cancelled' && 'Cancelled sessions'}
          {type === 'pending' && 'Awaiting confirmation'}
        </p>
      </CardContent>
    </Card>
  );
}