import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { SessionFeedback } from '@/types/session';

interface ReviewCardProps {
  review: SessionFeedback;
  studentName: string;
  studentAvatar?: string;
}

export default function ReviewCard({ review, studentName, studentAvatar }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={studentAvatar} />
          <AvatarFallback>{studentName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold">{studentName}</h4>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{review.review}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}