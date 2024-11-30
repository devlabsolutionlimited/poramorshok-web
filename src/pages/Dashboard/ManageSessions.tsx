import { useState } from 'react';
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
import { useMentorSessions } from '@/hooks/api/useMentorSessions';
import type { Session, SessionType } from '@/types/session';

export default function ManageSessions() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    date: undefined as Date | undefined
  });

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isCreateTypeModalOpen, setIsCreateTypeModalOpen] = useState(false);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null);

  const {
    sessions,
    stats,
    sessionTypes,
    isLoading,
    createSessionType,
    updateSessionType,
    deleteSessionType,
    updateSessionStatus,
    addSessionFeedback,
    isCreating,
    isUpdating,
    isDeleting
  } = useMentorSessions();

  const filteredSessions = sessions?.filter(session => {
    const matchesSearch = session.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         session.topic.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || session.status === filters.status;
    const matchesDate = !filters.date || session.date === filters.date.toISOString().split('T')[0];
    return matchesSearch && matchesStatus && matchesDate;
  });

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      date: undefined
    });
  };

  const handleCreateSessionType = async (data: Partial<SessionType>) => {
    await createSessionType(data);
    setIsCreateTypeModalOpen(false);
  };

  const handleUpdateSessionType = async (id: string, data: Partial<SessionType>) => {
    await updateSessionType({ id, data });
    setSelectedSessionType(null);
  };

  const handleDeleteSessionType = async (id: string) => {
    await deleteSessionType(id);
  };

  const handleUpdateSessionStatus = async (sessionId: string, newStatus: Session['status']) => {
    await updateSessionStatus({ id: sessionId, status: newStatus });
    setSelectedSession(null);
  };

  const handleAddFeedback = async (sessionId: string, feedback: { rating: number; review: string }) => {
    await addSessionFeedback({ id: sessionId, feedback });
    setSelectedSession(null);
  };

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
              count={stats?.upcoming || 0}
              type="upcoming"
            />
            <SessionStatusCard
              title="Completed Sessions"
              count={stats?.completed || 0}
              type="completed"
            />
            <SessionStatusCard
              title="Cancelled Sessions"
              count={stats?.cancelled || 0}
              type="cancelled"
            />
            <SessionStatusCard
              title="Pending Sessions"
              count={stats?.pending || 0}
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
            {sessionTypes?.map((sessionType) => (
              <SessionTypeCard
                key={sessionType.id}
                sessionType={sessionType}
                onEdit={() => setSelectedSessionType(sessionType)}
                onDelete={() => handleDeleteSessionType(sessionType.id)}
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
        onUpdateStatus={handleUpdateSessionStatus}
        onAddFeedback={handleAddFeedback}
      />

      {/* Create Session Type Dialog */}
      <CreateSessionTypeDialog
        isOpen={isCreateTypeModalOpen}
        onClose={() => setIsCreateTypeModalOpen(false)}
        onSubmit={handleCreateSessionType}
        isSubmitting={isCreating}
      />

      {/* Edit Session Type Dialog */}
      <EditSessionTypeDialog
        isOpen={!!selectedSessionType}
        onClose={() => setSelectedSessionType(null)}
        onSubmit={(data) => selectedSessionType && handleUpdateSessionType(selectedSessionType.id, data)}
        sessionType={selectedSessionType}
        isSubmitting={isUpdating}
      />
    </div>
  );
}