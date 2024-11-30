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
import { Search, CheckCircle, XCircle, AlertCircle, Info, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

// Mock API call
const fetchWithdrawals = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    withdrawals: [
      {
        id: '1',
        mentorId: 'm1',
        mentorName: 'Dr. Rahman Khan',
        amount: 15000,
        status: 'pending',
        paymentMethod: {
          type: 'bkash',
          number: '01712345678'
        },
        requestedAt: '2024-03-20T10:00:00Z',
        totalEarnings: 45000,
        pendingAmount: 15000,
        completedSessions: 24,
        transactionId: null
      },
      {
        id: '2',
        mentorId: 'm2',
        mentorName: 'Sarah Ahmed',
        amount: 25000,
        status: 'processing',
        paymentMethod: {
          type: 'bank',
          accountName: 'Sarah Ahmed',
          accountNumber: '1234567890',
          bankName: 'Dutch Bangla Bank'
        },
        requestedAt: '2024-03-19T15:30:00Z',
        totalEarnings: 75000,
        pendingAmount: 25000,
        completedSessions: 36,
        transactionId: 'TXN123456'
      }
    ]
  };
};

export default function WithdrawalRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [updateStatus, setUpdateStatus] = useState<{
    open: boolean;
    request: any;
  }>({ open: false, request: null });
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['withdrawal-requests'],
    queryFn: fetchWithdrawals
  });

  const handleApprove = async () => {
    try {
      // API call would go here
      console.log('Approving withdrawal:', { id: selectedRequest?.id, notes });
      
      toast({
        title: 'Withdrawal Approved',
        description: 'The withdrawal request has been approved and will be processed.',
      });
      
      setSelectedRequest(null);
      setNotes('');
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve withdrawal. Please try again.',
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
      console.log('Rejecting withdrawal:', { id: selectedRequest?.id, notes });
      
      toast({
        title: 'Withdrawal Rejected',
        description: 'The withdrawal request has been rejected.',
      });
      
      setSelectedRequest(null);
      setNotes('');
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject withdrawal. Please try again.',
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
      console.log('Updating status:', {
        id: updateStatus.request?.id,
        status: newStatus,
        transactionId
      });
      
      toast({
        title: 'Status Updated',
        description: `The withdrawal request has been marked as ${newStatus}.`,
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
            placeholder="Search by mentor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-medium">
                    {withdrawal.mentorName}
                  </TableCell>
                  <TableCell>৳{withdrawal.amount}</TableCell>
                  <TableCell>
                    {withdrawal.paymentMethod.type === 'bank' ? (
                      <div>
                        <p>{withdrawal.paymentMethod.bankName}</p>
                        <p className="text-sm text-muted-foreground">
                          {withdrawal.paymentMethod.accountNumber}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p>bKash</p>
                        <p className="text-sm text-muted-foreground">
                          {withdrawal.paymentMethod.number}
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(withdrawal.status)}>
                      {withdrawal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {withdrawal.transactionId || '-'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(withdrawal.requestedAt), 'PPP')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {withdrawal.status === 'pending' && (
                          <DropdownMenuItem onClick={() => setSelectedRequest(withdrawal)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Review Request
                          </DropdownMenuItem>
                        )}
                        {withdrawal.status === 'processing' && (
                          <DropdownMenuItem 
                            onClick={() => setUpdateStatus({ 
                              open: true, 
                              request: withdrawal 
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
            <DialogTitle>Review Withdrawal Request</DialogTitle>
            <DialogDescription>
              Review and process the withdrawal request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Mentor Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Mentor</h3>
                  <p className="text-muted-foreground">{selectedRequest.mentorName}</p>
                </div>
                <div>
                  <h3 className="font-medium">Completed Sessions</h3>
                  <p className="text-muted-foreground">{selectedRequest.completedSessions}</p>
                </div>
              </div>

              {/* Financial Info */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Total Earnings</h4>
                      <p className="text-2xl font-bold">৳{selectedRequest.totalEarnings}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Pending Amount</h4>
                      <p className="text-2xl font-bold">৳{selectedRequest.pendingAmount}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Withdrawal Amount</h4>
                      <p className="text-2xl font-bold">৳{selectedRequest.amount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <Card>
                  <CardContent className="pt-6">
                    {selectedRequest.paymentMethod.type === 'bank' ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank Name</span>
                          <span>{selectedRequest.paymentMethod.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Name</span>
                          <span>{selectedRequest.paymentMethod.accountName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Number</span>
                          <span>{selectedRequest.paymentMethod.accountNumber}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">bKash Number</span>
                          <span>{selectedRequest.paymentMethod.number}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="font-medium mb-2">Admin Notes</h3>
                <Textarea
                  placeholder="Add notes about this withdrawal request..."
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
            <DialogTitle>Update Withdrawal Status</DialogTitle>
            <DialogDescription>
              Update the status of this withdrawal request
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
                Required to mark the withdrawal as completed
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