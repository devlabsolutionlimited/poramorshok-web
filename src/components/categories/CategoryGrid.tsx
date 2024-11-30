import { Grid } from 'lucide-react';
import CategoryCard from './CategoryCard';
import type { Category } from '@/types/mentor';

const categories: Category[] = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'Language',
  'Academic',
  'Career'
];

interface CategoryGridProps {
  counts?: Record<Category, number>;
}

export default function CategoryGrid({ counts }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category}
          category={category}
          count={counts?.[category]}
        />
      ))}
    </div>
  );
}