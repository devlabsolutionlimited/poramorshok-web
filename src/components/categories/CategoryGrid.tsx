import { Grid } from 'lucide-react';
import CategoryCard from './CategoryCard';
import type { Category } from '@/types/mentor';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

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
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category}
          category={category}
          count={counts?.[category]}
          title={language === 'bn' ? translations.bn.categories.items[category] : category}
        />
      ))}
    </div>
  );
}