import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, Award, CheckCircle, ArrowRight } from 'lucide-react';
import CategoryGrid from '@/components/categories/CategoryGrid';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import { useTranslation } from '@/hooks/useTranslation';
import { translations } from '@/lib/translations';

export default function Home() {
  const { t, language } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Categories Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            {language === 'bn' ? translations.bn.categories.title : 'Browse by Category'}
          </h2>
          <CategoryGrid />
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}