import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '../Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/page-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, AlertTriangle, CheckCircle2, Ban, Eye, Clock } from 'lucide-react';
import ReportDetails from './ReportDetails';
import { Report } from './types';
import { filterReports, getStatusColor } from './utils';

// Mock API call
const fetchReports = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    reports: [
      {
        id: '1',
        type: 'refund_request',
        status: 'pending',
        sessionId: 'session_123',
        studentName: 'John Doe',
        mentorName: 'Dr. Rahman Khan',
        createdAt: '2024-03-20T10:00:00Z',
        description: 'Session was not completed as scheduled',
        riskScore: 75,
        session: {
          id: 'session_123',
          mentorId: 'mentor_1',
          studentId: 'student_1',
          date: '2024-03-20',
          startTime: '10:00',
          duration: 60,
          status: 'completed'
        },
        activityLogs: [
          {
            action: 'join',
            userId: 'student_1',
            timestamp: new Date('2024-03-20T10:00:00Z')
          },
          {
            action: 'join',
            userId: 'mentor_1',
            timestamp: new Date('2024-03-20T10:05:00Z')
          }
        ],
        evidence: [
          {
            type: 'screenshot',
            content: 'screenshot1.jpg',
            timestamp: new Date('2024-03-20T10:15:00Z')
          }
        ]
      },
      {
        id: '2',
        type: 'session_dispute',
        status: 'investigating',
        sessionId: 'session_456',
        studentName: 'Sarah Ahmed',
        mentorName: 'Jane Smith',
        createdAt: '2024-03-19T15:30:00Z',
        description: 'Mentor was unavailable during scheduled session',
        riskScore: 45,
        session: {
          id: 'session_456',
          mentorId: 'mentor_2',
          studentId: 'student_2',
          date: '2024-03-19',
          startTime: '14:00',
          duration: 60,
          status: 'cancelled'
        },
        activityLogs: [],
        evidence: []
      }
    ],
    stats: {
      pending: 5,
      investigating: 3,
      resolved: 12,
      rejected: 2,
      highRisk: 4,
      mediumRisk: 8,
      lowRisk: 10
    }
  };
};

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports
  });

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      // API call would go here
      console.log('Updating report status:', { reportId, newStatus });
      
      toast({
        title: 'Status Updated',
        description: 'Report status has been updated successfully.',
      });
      
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredReports = data?.reports ? filterReports(data.reports, searchQuery, statusFilter) : [];

  if (isLoading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reports & Fraud Protection</h1>
            <p className="text-muted-foreground">
              Manage reports and monitor potential fraud
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{data?.stats.highRisk}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.investigating}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{data?.stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">All Reports</TabsTrigger>
                  <TabsTrigger value="high-risk">High Risk</TabsTrigger>
                  <TabsTrigger value="refunds">Refund Requests</TabsTrigger>
                  <TabsTrigger value="disputes">Session Disputes</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                        <div>
                          <Badge
                            variant={report.type === 'refund_request' ? 'default' : 'secondary'}
                          >
                            {report.type === 'refund_request' ? 'Refund' : 'Dispute'}
                          </Badge>
                        </div>
                        <div>{report.studentName}</div>
                        <div>{report.mentorName}</div>
                        <div>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        <div>
                          <div className={`text-sm ${
                            report.riskScore >= 70 ? 'text-red-500' :
                            report.riskScore >= 40 ? 'text-yellow-500' :
                            'text-green-500'
                          }`}>
                            Risk Score: {report.riskScore}%
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>

        {/* Report Details Dialog */}
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Report Analysis</DialogTitle>
              <DialogDescription>
                Detailed analysis and fraud detection results
              </DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <ReportDetails
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}