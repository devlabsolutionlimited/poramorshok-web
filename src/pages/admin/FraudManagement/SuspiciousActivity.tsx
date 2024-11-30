import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  Ban, 
  UserX,
  Globe,
  CreditCard,
  LogIn,
  History
} from 'lucide-react';

interface SuspiciousActivity {
  id: string;
  userId: string;
  userName: string;
  type: 'login' | 'payment' | 'session' | 'profile';
  description: string;
  timestamp: string;
  status: 'investigating' | 'resolved' | 'blocked';
  riskScore: number;
  details: {
    type: string;
    value: string;
  }[];
  location?: {
    ip: string;
    country: string;
  };
}

const mockActivities: SuspiciousActivity[] = [
  {
    id: '1',
    userId: 'user_1',
    userName: 'John Doe',
    type: 'login',
    description: 'Multiple failed login attempts from different locations',
    timestamp: '2024-03-20T10:00:00Z',
    status: 'investigating',
    riskScore: 85,
    details: [
      { type: 'attempts', value: '5 failed attempts in 10 minutes' },
      { type: 'locations', value: '3 different countries' }
    ],
    location: {
      ip: '192.168.1.1',
      country: 'Unknown'
    }
  },
  {
    id: '2',
    userId: 'user_2',
    userName: 'Sarah Ahmed',
    type: 'payment',
    description: 'Unusual payment pattern detected',
    timestamp: '2024-03-19T15:30:00Z',
    status: 'blocked',
    riskScore: 90,
    details: [
      { type: 'transactions', value: 'Multiple large transactions in short period' },
      { type: 'cards', value: 'Multiple cards used' }
    ]
  }
];

export default function SuspiciousActivity() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockActivities.filter(a => a.status === 'investigating').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Users</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {mockActivities.filter(a => a.riskScore >= 70).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockActivities.filter(a => a.status === 'blocked').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {Math.round((mockActivities.filter(a => a.status === 'resolved').length / mockActivities.length) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 rounded-lg border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {activity.type === 'login' && (
                        <LogIn className="h-5 w-5 text-yellow-500" />
                      )}
                      {activity.type === 'payment' && (
                        <CreditCard className="h-5 w-5 text-red-500" />
                      )}
                      {activity.type === 'session' && (
                        <History className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <h3 className="font-medium">{activity.userName}</h3>
                        <p className="text-sm text-muted-foreground">
                          User ID: {activity.userId}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        activity.status === 'blocked' ? 'destructive' :
                        activity.status === 'resolved' ? 'secondary' :
                        'default'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>

                  {activity.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>IP: {activity.location.ip}</span>
                      <span>•</span>
                      <span>Country: {activity.location.country}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    {activity.details.map((detail, index) => (
                      <div
                        key={index}
                        className="text-sm bg-muted p-2 rounded-md flex items-center gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span>{detail.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-medium ${
                      activity.riskScore >= 70 ? 'text-red-500' :
                      activity.riskScore >= 40 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      Risk Score: {activity.riskScore}%
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Block User
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Investigate
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