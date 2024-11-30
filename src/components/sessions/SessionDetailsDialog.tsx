import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, MessageSquare, Star } from 'lucide-react';
import { format } from 'date-fns';

interface SessionFeedback {
  rating: number;
  review: string;
  createdAt: string;
}

interface SessionDetails {
  id: string;
  studentName: string;
  studentAvatar?: string;
  date: string;
  startTime: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  meetingLink?: string;
  topic: string;
  feedback?: SessionFeedback;
  cancellationReason?: string;
}

interface SessionDetailsDialogProps {
  session: SessionDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionDetailsDialog({
  session,
  isOpen,
  onClose
}: SessionDetailsDialogProps) {
  if (!session) return null;

  const statusColors = {
    upcoming: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
    pending: 'bg-yellow-500'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
          <DialogDescription>
            View detailed information about this session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session.studentAvatar} alt={session.studentName} />
              <AvatarFallback>{session.studentName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{session.studentName}</h3>
              <Badge className={statusColors[session.status]}>
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Session Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(session.date), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{session.startTime} ({session.duration} minutes)</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-1">Topic</h4>
              <p className="text-muted-foreground">{session.topic}</p>
            </div>

            {session.meetingLink && (
              <div>
                <h4 className="font-medium mb-2">Meeting Link</h4>
                <Button variant="outline" className="gap-2" asChild>
                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Join Meeting
                  </a>
                </Button>
              </div>
            )}

            {session.cancellationReason && (
              <div>
                <h4 className="font-medium mb-1">Cancellation Reason</h4>
                <p className="text-red-600">{session.cancellationReason}</p>
              </div>
            )}

            {session.feedback && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Student Feedback</h4>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < session.feedback!.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{session.feedback.review}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {format(new Date(session.feedback.createdAt), 'PPP')}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href={`/messages/${session.id}`}>
                <MessageSquare className="h-4 w-4" />
                Message Student
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}