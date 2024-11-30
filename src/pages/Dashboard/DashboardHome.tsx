import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/page-loader';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  Wallet,
  Star,
  ArrowRight,
  Video,
  GraduationCap,
  Share2,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  ExternalLink,
  Edit,
  TrendingUp,
  BookOpen,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock API calls
const fetchMentorStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    totalStudents: 24,
    totalSessions: 48,
    hoursSpent: 72,
    totalEarnings: 45000,
    averageRating: 4.8,
    customUrl: 'rahman-khan',
    profileViews: 156,
    bookingRate: 85,
    upcomingSessions: [
      {
        id: '1',
        studentName: 'John Doe',
        topic: 'Web Development',
        date: '2024-03-28',
        time: '10:00 AM',
        duration: 60,
        meetingLink: 'https://meet.google.com/abc-123'
      }
    ],
    recentReviews: [
      {
        id: '1',
        studentName: 'Alice Johnson',
        rating: 5,
        review: 'Excellent mentor! Very clear explanations and helpful guidance.',
        date: '2024-03-20'
      }
    ],
    popularTopics: [
      {
        topic: 'React Development',
        sessions: 15,
        rating: 4.9
      },
      {
        topic: 'System Design',
        sessions: 12,
        rating: 4.8
      }
    ],
    weeklyStats: [
      { day: 'Mon', sessions: 3, earnings: 6000 },
      { day: 'Tue', sessions: 2, earnings: 4000 },
      { day: 'Wed', sessions: 4, earnings: 8000 },
      { day: 'Thu', sessions: 3, earnings: 6000 },
      { day: 'Fri', sessions: 5, earnings: 10000 },
      { day: 'Sat', sessions: 2, earnings: 4000 },
      { day: 'Sun', sessions: 1, earnings: 2000 }
    ],
    recentActivities: [
      {
        id: '1',
        type: 'session_completed',
        description: 'Completed session with John Doe',
        time: '2 hours ago'
      },
      {
        id: '2',
        type: 'new_booking',
        description: 'New session booked by Sarah Ahmed',
        time: '5 hours ago'
      },
      {
        id: '3',
        type: 'review_received',
        description: 'Received a 5-star review from Mike Wilson',
        time: '1 day ago'
      }
    ]
  };
};

export default function DashboardHome() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['mentor-stats'],
    queryFn: fetchMentorStats,
  });

  const profileUrl = `${window.location.origin}/mentor/${stats?.customUrl || user?.id}`;

  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Link Copied!',
        description: 'Profile URL has been copied to your clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again or copy the URL manually.',
        variant: 'destructive',
      });
    }
  };

  const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const text = encodeURIComponent(`Book a mentoring session with me on Poramorshok!`);
    const url = encodeURIComponent(profileUrl);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your mentoring profile</p>
        </div>
        <Link to="/dashboard/manage-sessions">
          <Button>
            <BookOpen className="h-4 w-4 mr-2" />
            Manage Sessions
          </Button>
        </Link>
      </div>

      {/* Profile Sharing Card */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={profileUrl}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyProfileUrl}
                  className="shrink-0"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="shrink-0"
                >
                  <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareToSocial('twitter')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareToSocial('linkedin')}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareToSocial('facebook')}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button asChild>
                <Link to="/dashboard/profile">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {stats.profileViews} profile views
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {stats.bookingRate}% booking rate
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +3 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              +8 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Mentored</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursSpent}</div>
            <p className="text-xs text-muted-foreground">
              +12 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">
              +৳15,000 this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="earnings" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Sessions</CardTitle>
            <Link to="/dashboard/manage-sessions">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.upcomingSessions.map(session => (
                <div
                  key={session.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{session.topic}</p>
                    <p className="text-sm text-muted-foreground">with {session.studentName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{session.date}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{session.time}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4" />
                      Join
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className={`p-2 rounded-full bg-primary/10`}>
                    {activity.type === 'session_completed' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    {activity.type === 'new_booking' && <Calendar className="h-4 w-4 text-primary" />}
                    {activity.type === 'review_received' && <Star className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {stats.popularTopics.map((topic) => (
              <div key={topic.topic} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{topic.topic}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{topic.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{topic.sessions} sessions completed</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(topic.sessions / stats.totalSessions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}