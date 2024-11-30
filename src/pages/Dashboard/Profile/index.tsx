import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLoader } from '@/components/ui/page-loader';
import BasicInfo from './BasicInfo';
import Expertise from './Expertise';
import Education from './Education';
import Availability from './Availability';
import SocialLinks from './SocialLinks';

// Mock data fetching
const fetchMentorProfile = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    name: 'Dr. Rahman Khan',
    title: 'Senior Software Engineer',
    company: 'Google',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    about: `I'm a senior software engineer at Google with over 10 years of experience in full-stack development. I specialize in building scalable web applications and helping developers grow in their careers.`,
    expertise: ['Web Development', 'System Design', 'React', 'Node.js', 'Python', 'Machine Learning'],
    experience: 10,
    hourlyRate: 2000,
    languages: ['Bengali', 'English'],
    education: [
      {
        degree: 'MSc in Computer Science',
        institution: 'BUET',
        year: 2015,
        description: 'Specialized in Distributed Systems'
      },
      {
        degree: 'BSc in Computer Science',
        institution: 'BUET',
        year: 2013,
        description: 'Major in Software Engineering'
      }
    ],
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      timeSlots: [
        { start: '09:00', end: '17:00' }
      ],
      timezone: 'Asia/Dhaka'
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rahmankhan',
      github: 'https://github.com/rahmankhan',
      twitter: 'https://twitter.com/rahmankhan',
      website: 'https://rahmankhan.dev'
    }
  };
};

export default function Profile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['mentor-profile'],
    queryFn: fetchMentorProfile
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfo profile={profile} />
        </TabsContent>

        <TabsContent value="expertise">
          <Expertise profile={profile} />
        </TabsContent>

        <TabsContent value="education">
          <Education profile={profile} />
        </TabsContent>

        <TabsContent value="availability">
          <Availability profile={profile} />
        </TabsContent>

        <TabsContent value="social">
          <SocialLinks profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}