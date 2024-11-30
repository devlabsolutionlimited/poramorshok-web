import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './Layout';
import { PageLoader } from '@/components/ui/page-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Ban, 
  CheckCircle, 
  Eye, 
  FileCheck, 
  MoreVertical,
  Star,
  Search,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PermissionGuard from '@/components/admin/PermissionGuard';
import ActionButton from '@/components/admin/ActionButton';

// Mock data fetching
const fetchMentors = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    mentors: [
      {
        id: '1',
        name: 'Dr. Rahman Khan',
        email: 'rahman@example.com',
        expertise: ['Web Development', 'System Design'],
        status: 'pending',
        rating: 4.9,
        totalSessions: 48,
        joinedAt: '2024-01-15',
        isVerified: false
      },
      {
        id: '2',
        name: 'Sarah Ahmed',
        email: 'sarah@example.com',
        expertise: ['UI/UX Design', 'Product Management'],
        status: 'active',
        rating: 4.8,
        totalSessions: 36,
        joinedAt: '2024-02-01',
        isVerified: true
      }
    ]
  };
};

const verificationSchema = z.object({
  notes: z.string().min(1, 'Please provide verification notes'),
  status: z.enum(['approve', 'reject']),
});

const suspensionSchema = z.object({
  reason: z.string().min(1, 'Please provide a reason for suspension'),
  duration: z.string().min(1, 'Please select suspension duration'),
});

export default function AdminMentors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [verificationDialog, setVerificationDialog] = useState(false);
  const [suspensionDialog, setSuspensionDialog] = useState(false);
  const { toast } = useToast();

  const verificationForm = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      notes: '',
      status: 'approve',
    },
  });

  const suspensionForm = useForm({
    resolver: zodResolver(suspensionSchema),
    defaultValues: {
      reason: '',
      duration: '7',
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-mentors'],
    queryFn: fetchMentors
  });

  const handleVerification = async (data: z.infer<typeof verificationSchema>) => {
    try {
      // API call would go here
      console.log('Processing verification:', { mentorId: selectedMentor?.id, ...data });
      
      toast({
        title: data.status === 'approve' ? 'Mentor Verified' : 'Mentor Rejected',
        description: `The mentor has been ${data.status === 'approve' ? 'verified' : 'rejected'} successfully.`,
      });
      
      setVerificationDialog(false);
      setSelectedMentor(null);
      verificationForm.reset();
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process verification. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSuspension = async (data: z.infer<typeof suspensionSchema>) => {
    try {
      // API call would go here
      console.log('Processing suspension:', { mentorId: selectedMentor?.id, ...data });
      
      toast({
        title: 'Mentor Suspended',
        description: 'The mentor has been suspended successfully.',
      });
      
      setSuspensionDialog(false);
      setSelectedMentor(null);
      suspensionForm.reset();
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to suspend mentor. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <PermissionGuard permissions={['manage_mentors']}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Mentors Management</h1>
          </div>

          {/* Search */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Mentors Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.mentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {mentor.name}
                        {mentor.isVerified && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{mentor.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(mentor.status)}>
                        {mentor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {mentor.rating}
                      </div>
                    </TableCell>
                    <TableCell>{mentor.totalSessions}</TableCell>
                    <TableCell>{new Date(mentor.joinedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/mentor/${mentor.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          {!mentor.isVerified && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedMentor(mentor);
                                setVerificationDialog(true);
                              }}
                            >
                              <FileCheck className="h-4 w-4 mr-2" />
                              Verify Mentor
                            </DropdownMenuItem>
                          )}
                          {mentor.status === 'active' && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedMentor(mentor);
                                setSuspensionDialog(true);
                              }}
                              className="text-destructive"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend Mentor
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Verification Dialog */}
          <Dialog open={verificationDialog} onOpenChange={setVerificationDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Verify Mentor
                </DialogTitle>
                <DialogDescription>
                  Review and verify mentor application
                </DialogDescription>
              </DialogHeader>

              <Form {...verificationForm}>
                <form onSubmit={verificationForm.handleSubmit(handleVerification)} className="space-y-4">
                  <FormField
                    control={verificationForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="approve">Approve</SelectItem>
                            <SelectItem value="reject">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={verificationForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add verification notes..."
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
                      onClick={() => setVerificationDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Submit Verification
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Suspension Dialog */}
          <Dialog open={suspensionDialog} onOpenChange={setSuspensionDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Suspend Mentor
                </DialogTitle>
                <DialogDescription>
                  Temporarily suspend mentor access
                </DialogDescription>
              </DialogHeader>

              <Form {...suspensionForm}>
                <form onSubmit={suspensionForm.handleSubmit(handleSuspension)} className="space-y-4">
                  <FormField
                    control={suspensionForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suspension Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="permanent">Permanent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={suspensionForm.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Suspension</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain the reason for suspension..."
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
                      onClick={() => setSuspensionDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="destructive">
                      Suspend Mentor
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