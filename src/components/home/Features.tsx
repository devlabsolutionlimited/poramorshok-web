import { BookOpen, Users, Calendar, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

const features = [
  {
    title: 'Expert Guidance',
    titleBn: translations.bn.features.expertGuidance.title,
    description: 'Learn from professionals with real industry experience',
    descriptionBn: translations.bn.features.expertGuidance.description,
    icon: BookOpen
  },
  {
    title: '1:1 Sessions',
    titleBn: translations.bn.features.oneOnOne.title,
    description: 'Personalized mentoring sessions tailored to your needs',
    descriptionBn: translations.bn.features.oneOnOne.description,
    icon: Users
  },
  {
    title: 'Flexible Scheduling',
    titleBn: translations.bn.features.flexibleScheduling.title,
    description: 'Book sessions at times that work best for you',
    descriptionBn: translations.bn.features.flexibleScheduling.description,
    icon: Calendar
  },
  {
    title: 'Verified Mentors',
    titleBn: translations.bn.features.verifiedMentors.title,
    description: 'All mentors are carefully vetted for quality assurance',
    descriptionBn: translations.bn.features.verifiedMentors.description,
    icon: Award
  }
];

export default function Features() {
  const { language } = useLanguage();

  return (
    <section className="py-12 md:py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6">
                <Icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {language === 'bn' ? feature.titleBn : feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'bn' ? feature.descriptionBn : feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}