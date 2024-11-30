import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/page-loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

// Mock analytics data
const fetchAnalytics = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    totalEarnings: 45000,
    totalSessions: 24,
    averageRating: 4.8,
    completionRate: 95,
    sessionsByDay: [
      { date: '2024-03-20', sessions: 3 },
      { date: '2024-03-21', sessions: 2 },
      { date: '2024-03-22', sessions: 4 },
      { date: '2024-03-23', sessions: 1 },
      { date: '2024-03-24', sessions: 3 },
      { date: '2024-03-25', sessions: 2 },
      { date: '2024-03-26', sessions: 5 }
    ],
    topTopics: [
      { topic: 'Web Development', sessions: 10 },
      { topic: 'React', sessions: 8 },
      { topic: 'System Design', sessions: 6 }
    ]
  };
};

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['mentor-analytics'],
    queryFn: fetchAnalytics
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{analytics?.totalEarnings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.averageRating}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sessions by Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.sessionsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                />
                <Bar dataKey="sessions" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.topTopics.map((topic) => (
              <div key={topic.topic} className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium">{topic.topic}</div>
                  <div className="text-sm text-muted-foreground">
                    {topic.sessions} sessions
                  </div>
                </div>
                <div className="w-32">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(topic.sessions / analytics.totalSessions) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}