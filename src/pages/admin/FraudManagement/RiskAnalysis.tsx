import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Clock, UserX } from 'lucide-react';

interface RiskIncident {
  id: string;
  type: string;
  userId: string;
  userName: string;
  riskScore: number;
  timestamp: string;
}

interface RiskTrend {
  month: string;
  score: number;
}

interface RiskAnalysisProps {
  incidents?: RiskIncident[];
  trends?: RiskTrend[];
}

export default function RiskAnalysis({ incidents = [], trends = [] }: RiskAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Risk Score Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Score Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent High-Risk Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent High-Risk Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 rounded-lg border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {incident.type === 'multiple_refunds' ? (
                        <div className="p-2 rounded-full bg-yellow-100">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        </div>
                      ) : incident.type === 'suspicious_activity' ? (
                        <div className="p-2 rounded-full bg-red-100">
                          <UserX className="h-4 w-4 text-red-600" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-blue-100">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{incident.userName}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {incident.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={incident.riskScore >= 70 ? 'destructive' : 'secondary'}
                      className="ml-auto"
                    >
                      Risk Score: {incident.riskScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>User ID: {incident.userId}</span>
                    <span>{new Date(incident.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        incident.riskScore >= 70
                          ? 'bg-red-500'
                          : incident.riskScore >= 40
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${incident.riskScore}%` }}
                    />
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