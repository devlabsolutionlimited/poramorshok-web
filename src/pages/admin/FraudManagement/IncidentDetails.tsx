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
  Clock,
  Shield,
  FileText,
  Activity,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface Evidence {
  type: string;
  content: string;
  timestamp: string;
}

interface ActivityLog {
  type: string;
  description: string;
  timestamp: string;
}

interface IncidentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  incident: {
    id: string;
    type: string;
    userId: string;
    userName: string;
    sessionId?: string;
    description: string;
    timestamp: string;
    status: string;
    riskScore: number;
    evidence?: Evidence[];
    activityLogs?: ActivityLog[];
    resolution?: {
      status: string;
      reason: string;
      resolvedBy: string;
      resolvedAt: string;
    };
  } | null;
}

export default function IncidentDetails({
  isOpen,
  onClose,
  incident
}: IncidentDetailsProps) {
  if (!incident) return null;

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: 'High Risk', color: 'text-red-500' };
    if (score >= 40) return { label: 'Medium Risk', color: 'text-yellow-500' };
    return { label: 'Low Risk', color: 'text-green-500' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Incident Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the incident
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(80vh-8rem)]">
          <div className="space-y-6">
            {/* Overview */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{incident.userName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">ID: {incident.userId}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(incident.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
                {incident.resolution && (
                  <TabsTrigger value="resolution">Resolution</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {incident.type.replace('_', ' ')}
                    </Badge>
                    <div className={getRiskLevel(incident.riskScore).color}>
                      Risk Score: {incident.riskScore}%
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{incident.description}</p>
                  </div>

                  {incident.sessionId && (
                    <div>
                      <h3 className="font-medium mb-2">Session Information</h3>
                      <p className="text-muted-foreground">Session ID: {incident.sessionId}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4 mt-4">
                {incident.evidence?.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{item.content}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                {incident.activityLogs?.map((log, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">
                          {log.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{log.description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {incident.resolution && (
                <TabsContent value="resolution" className="space-y-4 mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        {getStatusIcon(incident.resolution.status)}
                        <span className="font-medium capitalize">
                          {incident.resolution.status}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Resolution Reason</h3>
                          <p className="text-muted-foreground">
                            {incident.resolution.reason}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Resolved by: {incident.resolution.resolvedBy}</span>
                          <span>
                            {new Date(incident.resolution.resolvedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}