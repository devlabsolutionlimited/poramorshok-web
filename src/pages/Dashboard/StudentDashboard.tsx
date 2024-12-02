import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/page-loader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Wallet,
  GraduationCap,
  Star,
  ArrowRight,
  Video
} from 'lucide-react';
import { useStudentDashboard } from '@/hooks/api/useStudentDashboard';

export default function StudentDashboard() {
  const { data: stats, isLoading, error } = useStudentDashboard();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500">Error Loading Dashboard</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'Failed to load dashboard data'}
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">No Dashboard Data</h2>
        <p className="text-muted-foreground">
          Start booking sessions to see your learning progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursLearned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalSpent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Sessions</CardTitle>
          <Link to="/dashboard/sessions">
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {stats.upcomingSessions.length ? (
            <div className="space-y-4">
              {stats.upcomingSessions.map(session => (
                <div key={session.id} className="flex items-start space-x-4 p-4 rounded-lg bg-secondary/50">
                  <div className="flex-1">
                    <h3 className="font-semibold">{session.topic}</h3>
                    <p className="text-sm text-muted-foreground">with {session.mentorName}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{session.time} ({session.duration} min)</span>
                    </div>
                  </div>
                  {session.meetingLink && (
                    <Button variant="outline" className="gap-2" asChild>
                      <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Video className="h-4 w-4" />
                        Join Session
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Upcoming Sessions</h3>
              <p className="text-muted-foreground mb-4">
                Book a session with a mentor to start learning
              </p>
              <Link to="/mentors">
                <Button>Find a Mentor</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stats.learningProgress.map(topic => (
              <div key={topic.topic} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{topic.topic}</span>
                  <span className="text-sm text-muted-foreground">
                    {topic.sessionsCompleted}/{topic.totalSessions} sessions
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Mentors */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Mentors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {stats.recentMentors.map(mentor => (
              <div
                key={mentor.id}
                className="flex items-center gap-4 p-4 rounded-lg border"
              >
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mentor.expertise.join(', ')}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{mentor.rating}</span>
                  </div>
                </div>
                <Link to={`/mentor/${mentor.id}`}>
                  <Button variant="ghost" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}