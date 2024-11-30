import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  Ban,
  Clock,
  RefreshCcw,
  AlertCircle,
  UserX,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Shield
} from 'lucide-react';

interface UserIncidentHistoryProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for different incident types
const mockRefunds = [
  {
    id: 'r1',
    sessionId: 'session_123',
    amount: 2000,
    reason: 'Technical issues during session',
    requestedAt: '2024-03-20T10:00:00Z',
    status: 'rejected',
    riskScore: 85,
    evidence: [
      { type: 'session_log', content: 'Session completed successfully' },
      { type: 'payment_history', content: 'Multiple refund attempts detected' }
    ]
  },
  {
    id: 'r2',
    sessionId: 'session_456',
    amount: 1500,
    reason: 'Mentor was unavailable',
    requestedAt: '2024-03-15T15:30:00Z',
    status: 'pending',
    riskScore: 65,
    evidence: [
      { type: 'chat_log', content: 'Mentor was present in chat' }
    ]
  }
];

const mockDisputes = [
  {
    id: 'd1',
    sessionId: 'session_789',
    type: 'session_quality',
    description: 'Session content did not match description',
    filedAt: '2024-03-18T14:00:00Z',
    status: 'investigating',
    riskScore: 75,
    evidence: [
      { type: 'session_recording', content: 'Recording shows covered topics' },
      { type: 'syllabus', content: 'Topics match session description' }
    ]
  },
  {
    id: 'd2',
    sessionId: 'session_101',
    type: 'technical_issue',
    description: 'Connection problems during session',
    filedAt: '2024-03-10T09:00:00Z',
    status: 'resolved',
    riskScore: 45,
    evidence: [
      { type: 'system_log', content: 'No server issues detected' }
    ]
  }
];

const mockSuspiciousActivities = [
  {
    id: 's1',
    type: 'login_attempt',
    description: 'Multiple failed login attempts from different locations',
    detectedAt: '2024-03-19T20:00:00Z',
    status: 'blocked',
    riskScore: 90,
    details: [
      { type: 'ip_addresses', value: '5 different IP addresses' },
      { type: 'locations', value: '3 different countries' }
    ]
  },
  {
    id: 's2',
    type: 'payment_pattern',
    description: 'Unusual payment behavior detected',
    detectedAt: '2024-03-17T16:45:00Z',
    status: 'monitoring',
    riskScore: 70,
    details: [
      { type: 'transactions', value: 'Multiple large transactions' },
      { type: 'frequency', value: '5 sessions booked in 1 hour' }
    ]
  }
];

export default function UserIncidentHistory({
  userId,
  userName,
  isOpen,
  onClose
}: UserIncidentHistoryProps) {
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'rejected':
      case 'blocked':
        return 'destructive';
      case 'resolved':
        return 'secondary';
      case 'investigating':
      case 'monitoring':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-destructive" />
            User Incident History
          </DialogTitle>
          <DialogDescription>
            Incident history and risk analysis for {userName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <div className="px-1">
              <TabsList>
                <TabsTrigger value="all">All Incidents</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
                <TabsTrigger value="disputes">Disputes</TabsTrigger>
                <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 mt-4">
              <TabsContent value="all" className="m-0">
                <div className="space-y-4">
                  {/* Refunds */}
                  {mockRefunds.map((refund) => (
                    <Card key={refund.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-yellow-500" />
                          <h3 className="font-medium">Refund Request</h3>
                          <Badge variant={getStatusBadgeVariant(refund.status)}>
                            {refund.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Amount: ৳{refund.amount} • Session: {refund.sessionId}
                        </p>
                        <p className="text-sm mb-2">{refund.reason}</p>
                        {refund.evidence && (
                          <div className="space-y-2 mb-2">
                            {refund.evidence.map((item, i) => (
                              <div key={i} className="text-sm bg-muted p-2 rounded-md">
                                {item.content}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {new Date(refund.requestedAt).toLocaleString()}
                          </span>
                          <Badge variant={refund.riskScore >= 70 ? 'destructive' : 'secondary'}>
                            Risk Score: {refund.riskScore}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Disputes */}
                  {mockDisputes.map((dispute) => (
                    <Card key={dispute.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          <h3 className="font-medium">Session Dispute</h3>
                          <Badge variant={getStatusBadgeVariant(dispute.status)}>
                            {dispute.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Type: {dispute.type.replace('_', ' ')} • Session: {dispute.sessionId}
                        </p>
                        <p className="text-sm mb-2">{dispute.description}</p>
                        {dispute.evidence && (
                          <div className="space-y-2 mb-2">
                            {dispute.evidence.map((item, i) => (
                              <div key={i} className="text-sm bg-muted p-2 rounded-md">
                                {item.content}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {new Date(dispute.filedAt).toLocaleString()}
                          </span>
                          <Badge variant={dispute.riskScore >= 70 ? 'destructive' : 'secondary'}>
                            Risk Score: {dispute.riskScore}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Suspicious Activities */}
                  {mockSuspiciousActivities.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-red-500" />
                          <h3 className="font-medium">Suspicious Activity</h3>
                          <Badge variant={getStatusBadgeVariant(activity.status)}>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Type: {activity.type.replace('_', ' ')}
                        </p>
                        <p className="text-sm mb-2">{activity.description}</p>
                        {activity.details && (
                          <div className="space-y-2 mb-2">
                            {activity.details.map((detail, i) => (
                              <div key={i} className="text-sm bg-muted p-2 rounded-md">
                                {detail.value}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {new Date(activity.detectedAt).toLocaleString()}
                          </span>
                          <Badge variant={activity.riskScore >= 70 ? 'destructive' : 'secondary'}>
                            Risk Score: {activity.riskScore}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="refunds" className="m-0">
                <div className="space-y-4">
                  {mockRefunds.map((refund) => (
                    <Card key={refund.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-yellow-500" />
                          <h3 className="font-medium">Refund Request</h3>
                          <Badge variant={getStatusBadgeVariant(refund.status)}>
                            {refund.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Amount: ৳{refund.amount} • Session: {refund.sessionId}
                        </p>
                        <p className="text-sm mb-2">{refund.reason}</p>
                        {refund.evidence && (
                          <div className="space-y-2 mb-2">
                            {refund.evidence.map((item, i) => (
                              <div key={i} className="text-sm bg-muted p-2 rounded-md">
                                {item.content}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {new Date(refund.requestedAt).toLocaleString()}
                          </span>
                          <Badge variant={refund.riskScore >= 70 ? 'destructive' : 'secondary'}>
                            Risk Score: {refund.riskScore}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="disputes" className="m-0">
                <div className="space-y-4">
                  {mockDisputes.map((dispute) => (
                    <Card key={dispute.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          <h3 className="font-medium">Session Dispute</h3>
                          <Badge variant={getStatusBadgeVariant(dispute.status)}>
                            {dispute.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Type: {dispute.type.replace('_', ' ')} • Session: {dispute.sessionId}
                        </p>
                        <p className="text-sm mb-2">{dispute.description}</p>
                        {dispute.evidence && (
                          <div className="space-y-2 mb-2">
                            {dispute.evidence.map((item, i) => (
                              <div key={i} className="text-sm bg-muted p-2 rounded-md">
                                {item.content}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {new Date(dispute.filedAt).toLocaleString()}
                          </span>
                          <Badge variant={dispute.riskScore >= 70 ? 'destructive' : 'secondary'}>
                            Risk Score: {dispute.riskScore}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="suspicious" className="m-0">
                <div className="space-y-4">
                  {mockSuspiciousActivities.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-red-500" />
                          <h3 className="font-medium">Suspicious Activity</h3>
                          <Badge variant={getStatusBadgeVariant(activity.status)}>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Type: {activity.type.replace('_', ' ')}
                        </p>
                        <p className="text-sm mb-2">{activity.description}</p>
                        {activity.details && (
                          <div className="space-y-2 mb-2">
                            {activity.details.map((detail, i) => (
                              <div key={i} className="text-sm bg-muted p-2 rounded-md">
                                {detail.value}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {new Date(activity.detectedAt).toLocaleString()}
                          </span>
                          <Badge variant={activity.riskScore >= 70 ? 'destructive' : 'secondary'}>
                            Risk Score: {activity.riskScore}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}