import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './Layout';
import { PageLoader } from '@/components/ui/page-loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, AlertTriangle, CheckCircle2, Ban, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PermissionGuard from '@/components/admin/PermissionGuard';

// Mock data fetching
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
        createdAt: '2024-03-20',
        description: 'Session was not completed as scheduled',
        evidence: {
          sessionLogs: true,
          screenshots: true,
          verificationCode: false,
          activityTimeline: true
        },
        riskScore: 75
      },
      {
        id: '2',
        type: 'session_dispute',
        status: 'investigating',
        sessionId: 'session_456',
        studentName: 'Sarah Ahmed',
        mentorName: 'Jane Smith',
        createdAt: '2024-03-19',
        description: 'Mentor did not show up for session',
        evidence: {
          sessionLogs: true,
          screenshots: false,
          verificationCode: true,
          activityTimeline: true
        },
        riskScore: 45
      }
    ]
  };
};

const resolutionSchema = z.object({
  resolution: z.string().min(1, 'Resolution is required'),
  action: z.enum(['approve', 'reject', 'escalate']),
  notes: z.string().optional(),
});

export default function AdminReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [resolutionDialog, setResolutionDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(resolutionSchema),
    defaultValues: {
      resolution: '',
      action: 'approve',
      notes: '',
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: fetchReports
  });

  const handleResolveReport = async (data: z.infer<typeof resolutionSchema>) => {
    try {
      // API call would go here
      console.log('Resolving report:', { reportId: selectedReport?.id, ...data });
      
      toast({
        title: 'Report Resolved',
        description: 'The report has been resolved successfully.',
      });
      
      setResolutionDialog(false);
      setSelectedReport(null);
      form.reset();
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 75) return { label: 'High Risk', color: 'text-red-500' };
    if (score >= 50) return { label: 'Medium Risk', color: 'text-yellow-500' };
    return { label: 'Low Risk', color: 'text-green-500' };
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PermissionGuard permissions={['manage_reports']}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Reports Management</h1>
          </div>

          {/* Search */}
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
          </div>

          {/* Reports Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="capitalize">
                      {report.type.replace('_', ' ')}
                    </TableCell>
                    <TableCell>{report.studentName}</TableCell>
                    <TableCell>{report.mentorName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={getRiskLevel(report.riskScore).color}>
                        {getRiskLevel(report.riskScore).label}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setResolutionDialog(true);
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Report Details Dialog */}
          <Dialog open={!!selectedReport && !resolutionDialog} onOpenChange={() => setSelectedReport(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Details</DialogTitle>
                <DialogDescription>
                  Review report information and evidence
                </DialogDescription>
              </DialogHeader>

              {selectedReport && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Type</h3>
                      <p className="text-muted-foreground capitalize">
                        {selectedReport.type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Status</h3>
                      <Badge className={getStatusColor(selectedReport.status)}>
                        {selectedReport.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-medium">Session ID</h3>
                      <p className="text-muted-foreground">#{selectedReport.sessionId}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Created At</h3>
                      <p className="text-muted-foreground">
                        {new Date(selectedReport.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Description</h3>
                    <p className="text-muted-foreground">{selectedReport.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Evidence Available</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedReport.evidence).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          {value ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Ban className="h-4 w-4 text-red-500" />
                          )}
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedReport(null)}>
                      Close
                    </Button>
                    {selectedReport.status === 'pending' && (
                      <Button onClick={() => setResolutionDialog(true)}>
                        Resolve Report
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Resolution Dialog */}
          <Dialog open={resolutionDialog} onOpenChange={setResolutionDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resolve Report</DialogTitle>
                <DialogDescription>
                  Take action on this report
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleResolveReport)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="action"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Action</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="approve">Approve Refund</SelectItem>
                            <SelectItem value="reject">Reject Report</SelectItem>
                            <SelectItem value="escalate">Escalate to Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resolution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resolution Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain the resolution..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internal Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any internal notes..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setResolutionDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Submit Resolution
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </PermissionGuard>
    </AdminLayout>
  );
}