import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, CheckCircle, XCircle, Info, AlertCircle, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

// Mock API call
const fetchRefunds = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    refunds: [
      {
        id: '1',
        studentId: 's1',
        studentName: 'John Doe',
        sessionId: 'session_1',
        mentorName: 'Dr. Rahman Khan',
        amount: 2000,
        status: 'pending',
        reason: 'Session was cancelled by mentor',
        requestedAt: '2024-03-20T10:00:00Z',
        sessionDetails: {
          date: '2024-03-19T14:00:00Z',
          duration: 60,
          topic: 'React Advanced Concepts'
        },
        transactionId: null
      },
      {
        id: '2',
        studentId: 's2',
        studentName: 'Alice Johnson',
        sessionId: 'session_2',
        mentorName: 'Sarah Ahmed',
        amount: 1500,
        status: 'processing',
        reason: 'Technical issues during session',
        requestedAt: '2024-03-19T15:30:00Z',
        sessionDetails: {
          date: '2024-03-19T10:00:00Z',
          duration: 30,
          topic: 'UI/UX Design Principles'
        },
        transactionId: null
      }
    ]
  };
};

export default function RefundRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [updateStatus, setUpdateStatus] = useState<{
    open: boolean;
    request: any;
  }>({ open: false, request: null });
  const [transactionId, setTransactionId] = useState('');
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['refund-requests'],
    queryFn: fetchRefunds
  });

  const handleApprove = async () => {
    try {
      // API call would go here
      console.log('Approving refund:', { id: selectedRequest?.id, notes });
      
      toast({
        title: 'Refund Approved',
        description: 'The refund request has been approved and will be processed.',
      });
      
      setSelectedRequest(null);
      setNotes('');
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve refund. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!notes) {
      toast({
        title: 'Notes Required',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // API call would go here
      console.log('Rejecting refund:', { id: selectedRequest?.id, notes });
      
      toast({
        title: 'Refund Rejected',
        description: 'The refund request has been rejected.',
      });
      
      setSelectedRequest(null);
      setNotes('');
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject refund. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (newStatus === 'completed' && !transactionId) {
      toast({
        title: 'Transaction ID Required',
        description: 'Please provide the transaction ID to mark as completed.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // API call would go here
      console.log('Updating refund status:', {
        id: updateStatus.request?.id,
        status: newStatus,
        transactionId
      });
      
      toast({
        title: 'Status Updated',
        description: `The refund request has been marked as ${newStatus}.`,
      });
      
      setUpdateStatus({ open: false, request: null });
      setTransactionId('');
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by student or mentor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Refunds Table */}
      <Card>
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.refunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell className="font-medium">
                    {refund.studentName}
                  </TableCell>
                  <TableCell>{refund.mentorName}</TableCell>
                  <TableCell>৳{refund.amount}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {refund.reason}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(refund.status)}>
                      {refund.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {refund.transactionId || '-'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(refund.requestedAt), 'PPP')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {refund.status === 'pending' && (
                          <DropdownMenuItem onClick={() => setSelectedRequest(refund)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Review Request
                          </DropdownMenuItem>
                        )}
                        {refund.status === 'processing' && (
                          <DropdownMenuItem 
                            onClick={() => setUpdateStatus({ 
                              open: true, 
                              request: refund 
                            })}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => {
        setSelectedRequest(null);
        setNotes('');
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Refund Request</DialogTitle>
            <DialogDescription>
              Review and process the refund request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Student & Session Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Student</h3>
                  <p className="text-muted-foreground">{selectedRequest.studentName}</p>
                </div>
                <div>
                  <h3 className="font-medium">Mentor</h3>
                  <p className="text-muted-foreground">{selectedRequest.mentorName}</p>
                </div>
              </div>

              {/* Session Details */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Session Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Date & Time</h4>
                      <p className="text-muted-foreground">
                        {format(new Date(selectedRequest.sessionDetails.date), 'PPP p')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Duration</h4>
                      <p className="text-muted-foreground">
                        {selectedRequest.sessionDetails.duration} minutes
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Topic</h4>
                      <p className="text-muted-foreground">
                        {selectedRequest.sessionDetails.topic}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refund Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Refund Amount</h3>
                  <p className="text-2xl font-bold">৳{selectedRequest.amount}</p>
                </div>
                <div>
                  <h3 className="font-medium">Requested At</h3>
                  <p className="text-muted-foreground">
                    {format(new Date(selectedRequest.requestedAt), 'PPP p')}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <h3 className="font-medium mb-2">Reason for Refund</h3>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{selectedRequest.reason}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="font-medium mb-2">Admin Notes</h3>
                <Textarea
                  placeholder="Add notes about this refund request..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  <Info className="h-4 w-4 inline-block mr-1" />
                  Notes are required when rejecting a request
                </p>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleReject()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  type="button"
                  onClick={() => handleApprove()}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog 
        open={updateStatus.open} 
        onOpenChange={(open) => {
          if (!open) {
            setUpdateStatus({ open: false, request: null });
            setTransactionId('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Refund Status</DialogTitle>
            <DialogDescription>
              Update the status of this refund request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Current Status</h3>
              <Badge className={getStatusColor(updateStatus.request?.status)}>
                {updateStatus.request?.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Transaction ID</h3>
              <Input
                placeholder="Enter transaction ID..."
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Required to mark the refund as completed
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">New Status</h3>
              <Select onValueChange={(value) => handleUpdateStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}