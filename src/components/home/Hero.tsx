import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Users, Star, ArrowRight } from 'lucide-react';
import HeroStats from './HeroStats';
import { useTranslation } from '@/hooks/useTranslation';

export default function Hero() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 bg-[#0EBE7F]/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-[#0EBE7F]/20">
              <Star className="h-4 w-4 text-[#0EBE7F]" />
              <span className="text-sm font-medium text-[#0EBE7F]">4.9/5 from 2000+ reviews</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {t('hero.title')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/mentors">
                    <Button size="lg" className="w-full sm:w-auto">
                      {t('hero.cta.primary')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/become-mentor">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      {t('hero.cta.secondary')}
                      <GraduationCap className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">{t('hero.stats.mentors')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm">{t('hero.stats.students')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats Grid */}
          <div className="relative lg:ml-8">
            <HeroStats />
            {/* Gradient Overlay */}
            <div className="absolute -inset-x-2 -top-2 -bottom-2 bg-gradient-to-br from-primary/30 to-secondary/30 blur-2xl opacity-20 rounded-[2rem]" />
          </div>
        </div>
      </div>
    </section>
  );
}