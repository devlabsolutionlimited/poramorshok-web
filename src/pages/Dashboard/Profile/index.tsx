import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLoader } from '@/components/ui/page-loader';
import BasicInfo from './BasicInfo';
import Expertise from './Expertise';
import Education from './Education';
import SocialLinks from './SocialLinks';
import { useMentorProfile } from '@/hooks/api/useMentorProfile';

export default function Profile() {
  const { profile, isLoading } = useMentorProfile();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Profile not found</h2>
        <p className="text-muted-foreground">
          There was an error loading your profile. Please try again later.
        </p>
      </div>
    );
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

        <TabsContent value="social">
          <SocialLinks profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}