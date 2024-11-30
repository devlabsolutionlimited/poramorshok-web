import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  company?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Ahmed',
    role: 'Software Developer',
    company: 'Google',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    content: 'The mentoring sessions helped me improve my coding skills significantly. My mentor was very patient and knowledgeable.',
    rating: 5
  },
  {
    id: '2',
    name: 'Rahul Khan',
    role: 'UI/UX Designer',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    content: 'Found an amazing mentor who helped me understand design principles better. The platform is very user-friendly.',
    rating: 5
  },
  {
    id: '3',
    name: 'Priya Patel',
    role: 'Product Manager',
    company: 'Amazon',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    content: 'Great platform for finding mentors. The scheduling system is flexible and the mentors are very professional.',
    rating: 5
  },
  {
    id: '4',
    name: 'Mohammad Ali',
    role: 'Data Scientist',
    company: 'Meta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    content: 'The mentorship I received was invaluable. It helped me transition into my dream role as a data scientist.',
    rating: 5
  }
];

const testimonialsBn = [
  {
    id: '1',
    name: translations.bn.testimonials.reviews.programming.name,
    role: translations.bn.testimonials.reviews.programming.role,
    company: translations.bn.testimonials.reviews.programming.company,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    content: translations.bn.testimonials.reviews.programming.content,
    rating: 5
  },
  {
    id: '2',
    name: translations.bn.testimonials.reviews.design.name,
    role: translations.bn.testimonials.reviews.design.role,
    company: translations.bn.testimonials.reviews.design.company,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    content: translations.bn.testimonials.reviews.design.content,
    rating: 5
  },
  {
    id: '3',
    name: translations.bn.testimonials.reviews.business.name,
    role: translations.bn.testimonials.reviews.business.role,
    company: translations.bn.testimonials.reviews.business.company,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    content: translations.bn.testimonials.reviews.business.content,
    rating: 5
  },
  {
    id: '4',
    name: translations.bn.testimonials.reviews.career.name,
    role: translations.bn.testimonials.reviews.career.role,
    company: translations.bn.testimonials.reviews.career.company,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    content: translations.bn.testimonials.reviews.career.content,
    rating: 5
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { language } = useLanguage();
  const currentTestimonials = language === 'bn' ? testimonialsBn : testimonials;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % currentTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTestimonials.length]);

  return (
    <section className="py-20 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'bn' ? translations.bn.testimonials.title : 'What Our Users Say'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'bn' ? translations.bn.testimonials.subtitle : 'Join thousands of satisfied users who have transformed their careers through our platform'}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Background Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Quote className="h-32 w-32 text-primary/10 rotate-12" />
          </div>

          {/* Testimonials Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTestimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={`p-6 backdrop-blur-sm bg-background/95 transition-all duration-500 ${
                  index === activeIndex
                    ? 'scale-105 shadow-xl border-primary'
                    : 'scale-95 opacity-70'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="text-muted-foreground relative">
                  <Quote className="h-4 w-4 absolute -left-2 -top-2 text-primary/20" />
                  {testimonial.content}
                </blockquote>
              </Card>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {currentTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-primary w-6'
                    : 'bg-primary/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}