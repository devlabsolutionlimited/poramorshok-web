import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, Award, CheckCircle, ArrowRight } from 'lucide-react';
import CategoryGrid from '@/components/categories/CategoryGrid';
import Hero from '@/components/home/Hero';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import { useTranslation } from '@/hooks/useTranslation';
import { translations } from '@/lib/translations';

const howItWorksSteps = [
  {
    title: 'Create Account',
    titleBn: 'অ্যাকাউন্ট তৈরি করুন',
    description: 'Sign up and complete your profile to get started',
    descriptionBn: 'শুরু করার জন্য সাইন আপ করুন এবং আপনার প্রোফাইল সম্পূর্ণ করুন'
  },
  {
    title: 'Find a Mentor',
    titleBn: 'মেন্টর খুঁজুন',
    description: 'Browse through our expert mentors and find the perfect match',
    descriptionBn: 'আমাদের বিশেষজ্ঞ মেন্টরদের মধ্যে থেকে আপনার জন্য সঠিক মেন্টর খুঁজে নিন'
  },
  {
    title: 'Book Session',
    titleBn: 'সেশন বুক করুন',
    description: 'Schedule a session at your preferred time',
    descriptionBn: 'আপনার পছন্দের সময়ে একটি সেশন শিডিউল করুন'
  },
  {
    title: 'Start Learning',
    titleBn: 'শেখা শুরু করুন',
    description: 'Join your session and begin your learning journey',
    descriptionBn: 'আপনার সেশনে যোগ দিন এবং আপনার শেখার যাত্রা শুরু করুন'
  }
];

const benefits = [
  {
    title: 'Expert Guidance',
    description: 'Learn from professionals with real industry experience',
    icon: BookOpen
  },
  {
    title: '1:1 Sessions',
    description: 'Personalized mentoring sessions tailored to your needs',
    icon: Users
  },
  {
    title: 'Flexible Scheduling',
    description: 'Book sessions at times that work best for you',
    icon: Calendar
  },
  {
    title: 'Verified Mentors',
    description: 'All mentors are carefully vetted for quality assurance',
    icon: Award
  }
];

export default function Home() {
  const { t, language } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            {language === 'bn' ? 'কিভাবে কাজ করে' : 'How It Works'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    {language === 'bn' ? step.titleBn : step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'bn' ? step.descriptionBn : step.description}
                  </p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            {language === 'bn' ? translations.bn.categories.title : 'Browse by Category'}
          </h2>
          <CategoryGrid />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6">
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}