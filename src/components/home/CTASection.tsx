import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, CheckCircle2, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

const stats = [
  {
    value: '2,000+',
    label: 'Active Mentors',
    labelBn: 'সক্রিয় মেন্টর',
    gradient: 'from-[#0EBE7F]/20 to-[#0EBE7F]/10'
  },
  {
    value: '10,000+',
    label: 'Students Mentored',
    labelBn: 'মেন্টরড শিক্ষার্থী',
    gradient: 'from-[#0EBE7F]/15 to-[#0EBE7F]/5'
  },
  {
    value: '50,000+',
    label: 'Hours of Learning',
    labelBn: 'শেখার ঘন্টা',
    gradient: 'from-[#0EBE7F]/10 to-[#0EBE7F]/5'
  }
];

const features = [
  'One-on-one personalized mentoring',
  'Flexible scheduling options',
  'Expert mentors from top companies',
  'Affordable pricing in BDT'
];

const featuresBn = [
  'ব্যক্তিগত ওয়ান-টু-ওয়ান মেন্টরিং',
  'নমনীয় সময়সূচি',
  'শীর্ষ কোম্পানির বিশেষজ্ঞ মেন্টর',
  'সাশ্রয়ী মূল্যে বাংলাদেশি টাকায়'
];

export default function CTASection() {
  const { language } = useLanguage();
  const currentFeatures = language === 'bn' ? featuresBn : features;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0EBE7F,transparent_50%)]" style={{ opacity: '0.15' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#0EBE7F,transparent_50%)]" style={{ opacity: '0.1' }} />
        <div className="absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_at_center,#0EBE7F,transparent_50%)]" style={{ opacity: '0.05' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0EBE7F]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#0EBE7F]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-[#0EBE7F]/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-[#0EBE7F]/20">
              <Sparkles className="h-4 w-4 text-[#0EBE7F]" />
              <span className="text-sm font-medium text-[#0EBE7F]">
                {language === 'bn' ? 'আপনার ক্যারিয়ার পরিবর্তন করুন' : 'Transform Your Career'}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0EBE7F] via-[#0EBE7F]/90 to-[#0EBE7F]/80">
              {language === 'bn' ? translations.bn.cta.title : 'Ready to Start Your Learning Journey?'}
            </h2>

            <p className="text-xl text-[#0EBE7F]/90 mb-8">
              {language === 'bn' ? translations.bn.cta.subtitle : 'Join thousands of students who are accelerating their careers with personalized mentorship'}
            </p>

            <div className="space-y-4 mb-8">
              {currentFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#0EBE7F]/20 blur group-hover:blur-md transition-all" />
                    <CheckCircle2 className="h-5 w-5 text-[#0EBE7F] relative" />
                  </div>
                  <span className="text-lg text-[#0EBE7F]/90 group-hover:text-[#0EBE7F] transition-colors">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto group relative overflow-hidden bg-[#0EBE7F] text-white hover:bg-[#0EBE7F]/90"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                  <span className="relative">
                    {language === 'bn' ? translations.bn.cta.button.primary : 'Get Started Today'}
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 relative" />
                </Button>
              </Link>
              <Link to="/mentors">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-[#0EBE7F]/20 text-[#0EBE7F] hover:bg-[#0EBE7F]/10 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0EBE7F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                  <span className="relative">
                    {language === 'bn' ? translations.bn.cta.button.secondary : 'Browse Mentors'}
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.gradient} blur-xl group-hover:blur-2xl transition-all`} />
                <div className="relative bg-[#0EBE7F]/5 backdrop-blur-sm rounded-xl p-6 text-center border border-[#0EBE7F]/10 hover:border-[#0EBE7F]/20 transition-colors">
                  <div className="text-3xl font-bold text-[#0EBE7F] mb-2 group-hover:scale-105 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#0EBE7F]/80">
                    {language === 'bn' ? stat.labelBn : stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}