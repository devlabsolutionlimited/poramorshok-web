import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Ban, DollarSign } from 'lucide-react';

interface RefundIncident {
  id: string;
  userId: string;
  userName: string;
  sessionId: string;
  amount: number;
  reason: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  riskScore: number;
  patterns: {
    type: string;
    description: string;
  }[];
}

const mockRefundIncidents: RefundIncident[] = [
  {
    id: '1',
    userId: 'user_1',
    userName: 'John Doe',
    sessionId: 'session_123',
    amount: 2000,
    reason: 'Technical issues during session',
    timestamp: '2024-03-20T16:00:00Z',
    status: 'pending',
    riskScore: 85,
    patterns: [
      { type: 'frequency', description: '3 refunds in 24 hours' },
      { type: 'amount', description: 'Higher than average refund amount' }
    ]
  },
  {
    id: '2',
    userId: 'user_2',
    userName: 'Sarah Ahmed',
    sessionId: 'session_456',
    amount: 1500,
    reason: 'Mentor unavailable',
    timestamp: '2024-03-19T15:30:00Z',
    status: 'rejected',
    riskScore: 75,
    patterns: [
      { type: 'timing', description: 'Multiple last-minute cancellations' }
    ]
  }
];

export default function RefundAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Refund Incidents</h2>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Refunds</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {mockRefundIncidents.filter(i => i.riskScore >= 70).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{mockRefundIncidents.reduce((sum, i) => sum + i.amount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Refunds</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRefundIncidents.filter(i => i.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refund List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {mockRefundIncidents.map((incident) => (
            <Card key={incident.id} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{incident.userName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Session ID: {incident.sessionId}
                    </p>
                  </div>
                  <Badge
                    variant={incident.status === 'pending' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {incident.status}
                  </Badge>
                </div>

                {/* Amount and Risk Score */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">৳{incident.amount}</div>
                  <div className="text-red-500 font-semibold">
                    Risk Score: {incident.riskScore}%
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <p className="text-muted-foreground">
                    Reason: {incident.reason}
                  </p>
                </div>

                {/* Suspicious Patterns */}
                <div>
                  <h4 className="font-semibold mb-2">Suspicious Patterns:</h4>
                  <div className="space-y-2">
                    {incident.patterns.map((pattern, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg"
                      >
                        <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span>{pattern.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    Requested: {new Date(incident.timestamp).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="text-red-500">
                      <Ban className="h-4 w-4 mr-2" />
                      Block User
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}