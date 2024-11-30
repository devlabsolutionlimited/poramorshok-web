import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import BookingModal from './BookingModal';
import type { Mentor } from '@/types/mentor';

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { id, name, title, company, avatar, expertise, rating, totalReviews, hourlyRate } = mentor;

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{title} at {company}</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-muted-foreground">({totalReviews} reviews)</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {expertise.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
          <p className="text-lg font-semibold">
            ৳{hourlyRate}/hour
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book Session
          </Button>
          <Link to={`/mentor/${id}`} className="flex-1">
            <Button className="w-full">View Profile</Button>
          </Link>
        </CardFooter>
      </Card>

      <BookingModal
        mentor={mentor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}