import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, Edit, Trash2, Star } from 'lucide-react';

interface SessionType {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  type: 'one-on-one' | 'group';
  maxParticipants?: number;
  topics: string[];
  totalBookings: number;
  rating: number;
  reviews: number;
}

interface SessionTypeCardProps {
  sessionType: SessionType;
  onEdit: (sessionType: SessionType) => void;
  onDelete: (id: string) => void;
}

export default function SessionTypeCard({
  sessionType,
  onEdit,
  onDelete
}: SessionTypeCardProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await onDelete(sessionType.id);
      toast({
        title: 'Session Type Deleted',
        description: 'The session type has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete session type. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{sessionType.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={sessionType.type === 'one-on-one' ? 'default' : 'secondary'}>
                {sessionType.type === 'one-on-one' ? '1:1 Session' : 'Group Session'}
              </Badge>
              {sessionType.type === 'group' && (
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  Up to {sessionType.maxParticipants}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(sessionType)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{sessionType.description}</p>

        <div className="flex flex-wrap gap-2">
          {sessionType.topics.map((topic) => (
            <Badge key={topic} variant="outline">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {sessionType.duration} minutes
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">৳{sessionType.price}</span>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Bookings</span>
            <span className="font-medium">{sessionType.totalBookings}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rating</span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {sessionType.rating} ({sessionType.reviews} reviews)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}