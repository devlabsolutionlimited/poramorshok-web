import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './Layout';
import { PageLoader } from '@/components/ui/page-loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Mock data fetching
const fetchSessions = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    sessions: [
      {
        id: '1',
        mentorName: 'Dr. Rahman Khan',
        studentName: 'John Doe',
        date: '2024-03-28',
        startTime: '10:00 AM',
        duration: 60,
        status: 'upcoming',
        topic: 'Web Development',
        rating: 0
      },
      {
        id: '2',
        mentorName: 'Sarah Ahmed',
        studentName: 'Alice Johnson',
        date: '2024-03-20',
        startTime: '2:00 PM',
        duration: 60,
        status: 'completed',
        topic: 'UI/UX Design',
        rating: 5
      }
    ]
  };
};

export default function AdminSessions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: fetchSessions
  });

  const handleViewDetails = (session) => {
    setSelectedSession(session);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sessions Management</h1>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sessions Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentor</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.mentorName}</TableCell>
                  <TableCell>{session.studentName}</TableCell>
                  <TableCell>{session.topic}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{new Date(session.date).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">{session.startTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>{session.duration} min</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {session.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{session.rating}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not rated</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(session)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Session Details Dialog */}
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                View detailed information about this session
              </DialogDescription>
            </DialogHeader>

            {selectedSession && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Mentor</h3>
                    <p className="text-muted-foreground">{selectedSession.mentorName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Student</h3>
                    <p className="text-muted-foreground">{selectedSession.studentName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Topic</h3>
                    <p className="text-muted-foreground">{selectedSession.topic}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Status</h3>
                    <Badge className={getStatusColor(selectedSession.status)}>
                      {selectedSession.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium">Date & Time</h3>
                    <p className="text-muted-foreground">
                      {new Date(selectedSession.date).toLocaleDateString()} at {selectedSession.startTime}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Duration</h3>
                    <p className="text-muted-foreground">{selectedSession.duration} minutes</p>
                  </div>
                </div>

                {selectedSession.rating > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Rating & Feedback</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedSession.rating}/5</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}