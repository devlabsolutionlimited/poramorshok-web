import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

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

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their careers through our platform
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
            {testimonials.map((testimonial, index) => (
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
            {testimonials.map((_, index) => (
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