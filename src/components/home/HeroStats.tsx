import { Card } from '@/components/ui/card';
import { Star, Users, Clock, Award } from 'lucide-react';

const stats = [
  {
    icon: Star,
    label: 'Average Rating',
    value: '4.9',
    color: 'bg-yellow-500/10 text-yellow-500'
  },
  {
    icon: Users,
    label: 'Active Students',
    value: '10K+',
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    icon: Clock,
    label: 'Hours Mentored',
    value: '50K+',
    color: 'bg-green-500/10 text-green-500'
  },
  {
    icon: Award,
    label: 'Expert Mentors',
    value: '2K+',
    color: 'bg-purple-500/10 text-purple-500'
  }
];

export default function HeroStats() {
  return (
    <div className="relative grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index}
            className="p-6 backdrop-blur-sm bg-white/50 hover:bg-white/80 transition-colors"
          >
            <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-4`}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        );
      })}
    </div>
  );
}