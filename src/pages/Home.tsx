import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, Award, CheckCircle, ArrowRight } from 'lucide-react';
import CategoryGrid from '@/components/categories/CategoryGrid';
import Hero from '@/components/home/Hero';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';

const howItWorks = [
  {
    title: 'Create Account',
    description: 'Sign up and complete your profile to get started'
  },
  {
    title: 'Find a Mentor',
    description: 'Browse through our expert mentors and find the perfect match'
  },
  {
    title: 'Book Session',
    description: 'Schedule a session at your preferred time'
  },
  {
    title: 'Start Learning',
    description: 'Join your session and begin your learning journey'
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
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
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
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Browse by Category</h2>
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