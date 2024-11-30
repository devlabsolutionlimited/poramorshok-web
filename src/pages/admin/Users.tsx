import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './Layout';
import { PageLoader } from '@/components/ui/page-loader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Ban, CheckCircle, Shield, UserPlus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PermissionGuard from '@/components/admin/PermissionGuard';
import ActionButton from '@/components/admin/ActionButton';

// Mock data fetching
const fetchUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    users: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        status: 'active',
        joinedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'mentor',
        status: 'active',
        joinedAt: '2024-02-01'
      },
      {
        id: '3',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        role: 'moderator',
        status: 'active',
        joinedAt: '2024-01-01'
      }
    ]
  };
};

const addModeratorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModeratorOpen, setIsAddModeratorOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addModeratorSchema>>({
    resolver: zodResolver(addModeratorSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers
  });

  const handleAddModerator = async (data: z.infer<typeof addModeratorSchema>) => {
    try {
      // API call would go here
      console.log('Adding moderator:', data);
      
      toast({
        title: 'Moderator Added',
        description: 'The moderator has been added successfully.',
      });
      
      setIsAddModeratorOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add moderator. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      // API call would go here
      console.log('Suspending user:', userId);
      
      toast({
        title: 'User Suspended',
        description: 'The user has been suspended.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to suspend user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // API call would go here
      console.log('Deleting user:', userId);
      
      toast({
        title: 'User Deleted',
        description: 'The user has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-purple-100 text-purple-800';
      case 'mentor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
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
      <PermissionGuard permissions={['manage_users', 'view_users']}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Users Management</h1>
            <ActionButton 
              permission="manage_users"
              onClick={() => setIsAddModeratorOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Moderator
            </ActionButton>
          </div>

          {/* Search */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.role === 'moderator' && (
                            <PermissionGuard permissions={['manage_users']} showError={false}>
                              <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Moderator
                              </DropdownMenuItem>
                            </PermissionGuard>
                          )}
                          <PermissionGuard permissions={['manage_users']} showError={false}>
                            <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          </PermissionGuard>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add Moderator Dialog */}
          <Dialog open={isAddModeratorOpen} onOpenChange={setIsAddModeratorOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Moderator</DialogTitle>
                <DialogDescription>
                  Create a new moderator account
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddModerator)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddModeratorOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Moderator</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </PermissionGuard>
    </AdminLayout>
  );
}