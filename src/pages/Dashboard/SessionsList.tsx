import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLoader } from '@/components/ui/page-loader';
import SessionCard from '@/components/sessions/SessionCard';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import type { Session } from '@/types/session';

// Mock API call
const fetchSessions = async (userId: string): Promise<Session[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    {
      id: '1',
      mentorId: '2',
      studentId: '1',
      date: '2024-03-28',
      startTime: '10:00 AM',
      duration: 60,
      status: 'confirmed',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      mentorId: '2',
      studentId: '1',
      date: '2024-03-20',
      startTime: '2:00 PM',
      duration: 60,
      status: 'completed'
    },
    {
      id: '3',
      mentorId: '3',
      studentId: '1',
      date: '2024-03-15',
      startTime: '11:00 AM',
      duration: 30,
      status: 'cancelled'
    }
  ];
};

export default function SessionsList() {
  const { user } = useAuth();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: () => fetchSessions(user?.id || ''),
    enabled: !!user,
  });

  const handleJoinSession = (sessionId: string) => {
    // Handle joining the session
    window.open('https://meet.google.com/abc-defg-hij', '_blank');
  };

  const handleCancelSession = async (sessionId: string) => {
    // Handle cancelling the session
    console.log('Cancelling session:', sessionId);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <Link to="/mentors">
          <Button>Schedule Session</Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {sessions
            ?.filter((session) => ['pending', 'confirmed'].includes(session.status))
            .map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoin={() => handleJoinSession(session.id)}
                onCancel={() => handleCancelSession(session.id)}
              />
            ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {sessions
            ?.filter((session) => session.status === 'completed')
            .map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {sessions
            ?.filter((session) => session.status === 'cancelled')
            .map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}