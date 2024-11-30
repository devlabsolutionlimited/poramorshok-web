import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/mentor';
import {
  Code2,
  Palette,
  LineChart,
  Megaphone,
  Database,
  Languages,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  count?: number;
  className?: string;
  title?: string;
}

const categoryIcons = {
  Programming: Code2,
  Design: Palette,
  Business: LineChart,
  Marketing: Megaphone,
  'Data Science': Database,
  Language: Languages,
  Academic: GraduationCap,
  Career: Briefcase,
};

const categoryColors = {
  Programming: 'bg-blue-500/10 text-blue-500',
  Design: 'bg-purple-500/10 text-purple-500',
  Business: 'bg-green-500/10 text-green-500',
  Marketing: 'bg-orange-500/10 text-orange-500',
  'Data Science': 'bg-red-500/10 text-red-500',
  Language: 'bg-yellow-500/10 text-yellow-500',
  Academic: 'bg-indigo-500/10 text-indigo-500',
  Career: 'bg-pink-500/10 text-pink-500',
};

export default function CategoryCard({ category, count, className, title }: CategoryCardProps) {
  const Icon = categoryIcons[category];
  const colorClass = categoryColors[category];

  return (
    <Link to={`/mentors?category=${category}`}>
      <Card className={cn('hover:shadow-md transition-shadow', className)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={cn('p-3 rounded-lg', colorClass)}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">{title || category}</h3>
              {count !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {count} mentor{count !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}