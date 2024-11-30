import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/page-loader';
import { format } from 'date-fns';
import { Star } from 'lucide-react';

// Mock session history data
const fetchSessionHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      studentName: 'John Doe',
      date: '2024-03-20',
      duration: 60,
      topic: 'Web Development',
      rating: 5,
      review: 'Great session! Very helpful and clear explanations.'
    },
    {
      id: '2',
      studentName: 'Alice Johnson',
      date: '2024-03-15',
      duration: 30,
      topic: 'React Fundamentals',
      rating: 4,
      review: 'Good session, helped me understand React concepts better.'
    }
  ];
};

export default function SessionHistory() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['session-history'],
    queryFn: fetchSessionHistory
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Session History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Past Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions?.map(session => (
              <div
                key={session.id}
                className="p-4 rounded-lg border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{session.studentName}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < session.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-muted text-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Topic: {session.topic}</p>
                  <p>Date: {format(new Date(session.date), 'PPP')}</p>
                  <p>Duration: {session.duration} minutes</p>
                </div>
                {session.review && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Review:</p>
                    <p className="text-muted-foreground">{session.review}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}