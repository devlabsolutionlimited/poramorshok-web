import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageSquare, Shield, Ban } from 'lucide-react';

interface DisputeIncident {
  id: string;
  userId: string;
  userName: string;
  mentorName: string;
  sessionId: string;
  type: 'no_show' | 'quality' | 'technical' | 'behavior';
  description: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'escalated';
  riskScore: number;
  evidence?: {
    type: string;
    content: string;
  }[];
}

const mockDisputes: DisputeIncident[] = [
  {
    id: '1',
    userId: 'user_1',
    userName: 'John Doe',
    mentorName: 'Dr. Rahman Khan',
    sessionId: 'session_123',
    type: 'no_show',
    description: 'Mentor did not attend the scheduled session',
    timestamp: '2024-03-20T10:00:00Z',
    status: 'pending',
    riskScore: 85,
    evidence: [
      { type: 'session_log', content: 'No mentor activity detected' },
      { type: 'chat_log', content: 'Student waited for 15 minutes' }
    ]
  },
  {
    id: '2',
    userId: 'user_2',
    userName: 'Sarah Ahmed',
    mentorName: 'Jane Smith',
    sessionId: 'session_456',
    type: 'quality',
    description: 'Session content did not match description',
    timestamp: '2024-03-19T15:30:00Z',
    status: 'resolved',
    riskScore: 45,
    evidence: [
      { type: 'session_recording', content: 'Recording available' }
    ]
  }
];

export default function DisputeAnalysis() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDisputes.filter(d => d.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Cases</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {mockDisputes.filter(d => d.riskScore >= 70).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {Math.round((mockDisputes.filter(d => d.status === 'resolved').length / mockDisputes.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dispute List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {mockDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="p-4 rounded-lg border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{dispute.userName}</h3>
                      <p className="text-sm text-muted-foreground">
                        vs. {dispute.mentorName}
                      </p>
                    </div>
                    <Badge
                      variant={
                        dispute.status === 'escalated' ? 'destructive' :
                        dispute.status === 'resolved' ? 'secondary' :
                        'default'
                      }
                    >
                      {dispute.status}
                    </Badge>
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">
                      {dispute.type.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {dispute.description}
                    </p>
                  </div>

                  {dispute.evidence && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Evidence:</p>
                      {dispute.evidence.map((item, index) => (
                        <div
                          key={index}
                          className="text-sm bg-muted p-2 rounded-md"
                        >
                          <span className="font-medium capitalize">
                            {item.type.replace('_', ' ')}:
                          </span>{' '}
                          {item.content}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-medium ${
                      dispute.riskScore >= 70 ? 'text-red-500' :
                      dispute.riskScore >= 40 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      Risk Score: {dispute.riskScore}%
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Escalate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}