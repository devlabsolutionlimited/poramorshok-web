import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLoader } from '@/components/ui/page-loader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionStatusCard from '@/components/sessions/SessionStatusCard';
import SessionFilters from '@/components/sessions/SessionFilters';
import SessionDetailsDialog from '@/components/sessions/SessionDetailsDialog';
import SessionCard from '@/components/sessions/SessionCard';
import CreateSessionTypeDialog from '@/components/sessions/CreateSessionTypeDialog';
import EditSessionTypeDialog from '@/components/sessions/EditSessionTypeDialog';
import SessionTypeCard from '@/components/sessions/SessionTypeCard';
import { useToast } from '@/hooks/use-toast';

// Mock data
const fetchSessions = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    sessions: [
      {
        id: '1',
        studentName: 'Sarah Ahmed',
        studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        date: '2024-03-28',
        startTime: '10:00 AM',
        duration: 60,
        status: 'upcoming',
        meetingLink: 'https://meet.google.com/abc-123',
        topic: 'React Advanced Concepts'
      },
      {
        id: '2',
        studentName: 'John Doe',
        studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        date: '2024-03-20',
        startTime: '2:00 PM',
        duration: 60,
        status: 'completed',
        topic: 'JavaScript Fundamentals',
        feedback: {
          rating: 5,
          review: 'Excellent session! The mentor was very knowledgeable and helped me understand complex concepts easily.',
          createdAt: '2024-03-20T14:00:00Z'
        }
      }
    ],
    stats: {
      upcoming: 5,
      completed: 48,
      cancelled: 3,
      pending: 2
    },
    sessionTypes: [
      {
        id: '1',
        title: '1:1 Web Development Mentoring',
        description: 'Personalized mentoring session focused on your specific needs and goals.',
        duration: 60,
        price: 2000,
        type: 'one-on-one',
        topics: ['React', 'Node.js', 'TypeScript'],
        totalBookings: 12,
        rating: 4.8,
        reviews: 8
      },
      {
        id: '2',
        title: 'System Design Workshop',
        description: 'Group workshop on system design principles and practices.',
        duration: 120,
        price: 3000,
        type: 'group',
        maxParticipants: 5,
        topics: ['System Design', 'Architecture', 'Scalability'],
        totalBookings: 25,
        rating: 4.9,
        reviews: 15
      }
    ]
  };
};

export default function ManageSessions() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    date: undefined as Date | undefined
  });

  const [selectedSession, setSelectedSession] = useState(null);
  const [isCreateTypeModalOpen, setIsCreateTypeModalOpen] = useState(false);
  const [selectedSessionType, setSelectedSessionType] = useState(null);
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['mentor-sessions'],
    queryFn: fetchSessions
  });

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      date: undefined
    });
  };

  const handleEditSessionType = (sessionType) => {
    setSelectedSessionType(sessionType);
  };

  const handleDeleteSessionType = async (id: string) => {
    try {
      // API call would go here
      console.log('Deleting session type:', id);
      toast({
        title: 'Session Type Deleted',
        description: 'The session type has been deleted successfully.',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete session type. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredSessions = data?.sessions.filter(session => {
    const matchesSearch = session.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         session.topic.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || session.status === filters.status;
    const matchesDate = !filters.date || session.date === filters.date.toISOString().split('T')[0];
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sessions" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Sessions</h1>
            <TabsList className="mt-4">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="types">Session Types</TabsTrigger>
            </TabsList>
          </div>
          <Button onClick={() => setIsCreateTypeModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Session Type
          </Button>
        </div>

        <TabsContent value="sessions" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <SessionStatusCard
              title="Upcoming Sessions"
              count={data?.stats.upcoming || 0}
              type="upcoming"
            />
            <SessionStatusCard
              title="Completed Sessions"
              count={data?.stats.completed || 0}
              type="completed"
            />
            <SessionStatusCard
              title="Cancelled Sessions"
              count={data?.stats.cancelled || 0}
              type="cancelled"
            />
            <SessionStatusCard
              title="Pending Sessions"
              count={data?.stats.pending || 0}
              type="pending"
            />
          </div>

          {/* Filters */}
          <SessionFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
          />

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions?.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onViewDetails={() => setSelectedSession(session)}
              />
            ))}
            {filteredSessions?.length === 0 && (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-semibold">No sessions found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to find more sessions
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.sessionTypes.map((sessionType) => (
              <SessionTypeCard
                key={sessionType.id}
                sessionType={sessionType}
                onEdit={handleEditSessionType}
                onDelete={handleDeleteSessionType}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Session Details Dialog */}
      <SessionDetailsDialog
        session={selectedSession}
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />

      {/* Create Session Type Dialog */}
      <CreateSessionTypeDialog
        isOpen={isCreateTypeModalOpen}
        onClose={() => setIsCreateTypeModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsCreateTypeModalOpen(false);
        }}
      />

      {/* Edit Session Type Dialog */}
      <EditSessionTypeDialog
        isOpen={!!selectedSessionType}
        onClose={() => setSelectedSessionType(null)}
        onSuccess={() => {
          refetch();
          setSelectedSessionType(null);
        }}
        sessionType={selectedSessionType}
      />
    </div>
  );
}