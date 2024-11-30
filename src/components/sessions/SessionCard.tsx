import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Video,
  ExternalLink,
  MessageSquare,
  Star,
  Ban,
  AlertCircle,
  CheckCircle2,
  Eye,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SessionCardProps {
  session: {
    id: string;
    studentName: string;
    studentAvatar?: string;
    date: string;
    startTime: string;
    duration: number;
    status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
    meetingLink?: string;
    topic: string;
    feedback?: {
      rating: number;
      review: string;
      createdAt: string;
    };
  };
  onViewDetails: () => void;
}

export default function SessionCard({ session, onViewDetails }: SessionCardProps) {
  const statusConfig = {
    upcoming: {
      icon: Calendar,
      color: 'text-blue-500 bg-blue-50 border-blue-200',
      label: 'Upcoming'
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-500 bg-green-50 border-green-200',
      label: 'Completed'
    },
    cancelled: {
      icon: Ban,
      color: 'text-red-500 bg-red-50 border-red-200',
      label: 'Cancelled'
    },
    pending: {
      icon: AlertCircle,
      color: 'text-yellow-500 bg-yellow-50 border-yellow-200',
      label: 'Pending'
    }
  };

  const StatusIcon = statusConfig[session.status].icon;

  const isJoinable = session.status === 'upcoming' && session.meetingLink;
  const sessionDate = new Date(session.date);
  const isToday = format(sessionDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isUpcoming = sessionDate > new Date();

  const handleJoinMeeting = () => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow",
      isToday && "border-blue-500",
      session.status === 'cancelled' && "opacity-75"
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section - Student Info & Session Status */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session.studentAvatar} alt={session.studentName} />
              <AvatarFallback>{session.studentName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{session.studentName}</h3>
              <Badge 
                variant="outline" 
                className={cn("flex items-center gap-1 mt-1", statusConfig[session.status].color)}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig[session.status].label}
              </Badge>
            </div>
          </div>

          {/* Middle Section - Session Details */}
          <div className="flex-1 space-y-2">
            <div className="font-medium">{session.topic}</div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(sessionDate, 'MMMM d, yyyy')}
                  {isToday && (
                    <Badge variant="secondary" className="ml-2">Today</Badge>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{session.startTime} ({session.duration} minutes)</span>
              </div>
            </div>

            {session.feedback && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
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
                <span className="text-sm text-muted-foreground">
                  {format(new Date(session.feedback.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex md:flex-col gap-2 justify-end">
            {isJoinable && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="gap-2 w-full" 
                      onClick={handleJoinMeeting}
                    >
                      <Video className="h-4 w-4" />
                      Join Meeting
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Join the video meeting</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      asChild
                    >
                      <a href={`/messages/${session.id}`}>
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Message student</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={onViewDetails}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View session details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {session.meetingLink && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        asChild
                      >
                        <a 
                          href={session.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open meeting link</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}