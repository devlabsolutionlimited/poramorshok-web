import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AdminLayout from './Layout';
import { PageLoader } from '@/components/ui/page-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MoreVertical, 
  Shield, 
  UserCog, 
  Ban,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PERMISSION_CATEGORIES, Permission } from '@/lib/permissions';
import PermissionGuard from '@/components/admin/PermissionGuard';

// Mock data fetching
const fetchModerators = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    moderators: [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        status: 'active',
        permissions: ['view_users', 'view_mentors', 'view_sessions'],
        lastActive: '2024-03-20T10:00:00Z'
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        status: 'inactive',
        permissions: ['view_users', 'manage_mentors', 'manage_sessions'],
        lastActive: '2024-03-19T15:30:00Z'
      }
    ]
  };
};

const permissionFormSchema = z.object({
  permissions: z.array(z.string())
});

const statusChangeSchema = z.object({
  reason: z.string().min(1, 'Please provide a reason'),
});

export default function AdminModerators() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModerator, setSelectedModerator] = useState<any>(null);
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    open: boolean;
    moderator: any;
    action: 'activate' | 'deactivate';
  }>({
    open: false,
    moderator: null,
    action: 'deactivate'
  });
  
  const { toast } = useToast();

  const permissionForm = useForm<z.infer<typeof permissionFormSchema>>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      permissions: [],
    },
  });

  const statusForm = useForm<z.infer<typeof statusChangeSchema>>({
    resolver: zodResolver(statusChangeSchema),
    defaultValues: {
      reason: '',
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-moderators'],
    queryFn: fetchModerators
  });

  const handleUpdatePermissions = async (data: z.infer<typeof permissionFormSchema>) => {
    try {
      // API call would go here
      console.log('Updating permissions:', {
        moderatorId: selectedModerator?.id,
        permissions: data.permissions
      });
      
      toast({
        title: 'Permissions Updated',
        description: 'Moderator permissions have been updated successfully.',
      });
      
      setSelectedModerator(null);
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update permissions. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (data: z.infer<typeof statusChangeSchema>) => {
    try {
      const { moderator, action } = statusChangeDialog;
      
      // API call would go here
      console.log('Updating moderator status:', {
        moderatorId: moderator?.id,
        action,
        reason: data.reason
      });
      
      toast({
        title: action === 'activate' ? 'Moderator Activated' : 'Moderator Deactivated',
        description: `The moderator has been ${action === 'activate' ? 'activated' : 'deactivated'} successfully.`,
      });
      
      setStatusChangeDialog({ open: false, moderator: null, action: 'deactivate' });
      statusForm.reset();
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update moderator status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleManagePermissions = (moderator: any) => {
    setSelectedModerator(moderator);
    permissionForm.reset({
      permissions: moderator.permissions
    });
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
      <PermissionGuard permissions={['manage_users']}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Moderators Management</h1>
          </div>

          {/* Search */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search moderators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Moderators Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.moderators.map((moderator) => (
                  <TableRow key={moderator.id}>
                    <TableCell className="font-medium">{moderator.name}</TableCell>
                    <TableCell>{moderator.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={moderator.status === 'active' ? 'default' : 'secondary'}
                      >
                        {moderator.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(moderator.lastActive).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {moderator.permissions.slice(0, 2).map((permission) => (
                          <Badge key={permission} variant="outline">
                            {permission.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {moderator.permissions.length > 2 && (
                          <Badge variant="outline">
                            +{moderator.permissions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleManagePermissions(moderator)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          {moderator.status === 'active' ? (
                            <DropdownMenuItem 
                              onClick={() => setStatusChangeDialog({
                                open: true,
                                moderator,
                                action: 'deactivate'
                              })}
                              className="text-destructive"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Deactivate Moderator
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => setStatusChangeDialog({
                                open: true,
                                moderator,
                                action: 'activate'
                              })}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate Moderator
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

          {/* Permissions Dialog */}
          <Dialog open={!!selectedModerator} onOpenChange={() => setSelectedModerator(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Manage Permissions
                </DialogTitle>
                <DialogDescription>
                  Configure permissions for {selectedModerator?.name}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-4">
                <Form {...permissionForm}>
                  <form onSubmit={permissionForm.handleSubmit(handleUpdatePermissions)} className="space-y-6">
                    <div className="space-y-4">
                      {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium capitalize">
                            {category.replace('_', ' ')}
                          </h4>
                          <div className="grid gap-2">
                            {permissions.map((permission) => (
                              <FormField
                                key={permission}
                                control={permissionForm.control}
                                name="permissions"
                                render={({ field }) => (
                                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base capitalize">
                                        {permission.replace(/_/g, ' ')}
                                      </FormLabel>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value?.includes(permission)}
                                        onCheckedChange={(checked) => {
                                          const current = field.value || [];
                                          const next = checked
                                            ? [...current, permission]
                                            : current.filter((value) => value !== permission);
                                          field.onChange(next);
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </form>
                </Form>
              </ScrollArea>

              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedModerator(null)}
                >
                  Cancel
                </Button>
                <Button onClick={permissionForm.handleSubmit(handleUpdatePermissions)}>
                  Save Permissions
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Status Change Dialog */}
          <Dialog 
            open={statusChangeDialog.open} 
            onOpenChange={(open) => !open && setStatusChangeDialog({ 
              open: false, 
              moderator: null, 
              action: 'deactivate' 
            })}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {statusChangeDialog.action === 'deactivate' ? (
                    <>
                      <Ban className="h-5 w-5 text-destructive" />
                      Deactivate Moderator
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Activate Moderator
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {statusChangeDialog.action === 'deactivate'
                    ? 'Are you sure you want to deactivate this moderator? They will lose access to all moderator functions.'
                    : 'Are you sure you want to reactivate this moderator? They will regain access to their assigned permissions.'
                  }
                </DialogDescription>
              </DialogHeader>

              <Form {...statusForm}>
                <form onSubmit={statusForm.handleSubmit(handleStatusChange)} className="space-y-4">
                  <FormField
                    control={statusForm.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Reason for ${statusChangeDialog.action === 'deactivate' ? 'deactivation' : 'activation'}...`}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be logged for administrative purposes
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStatusChangeDialog({
                        open: false,
                        moderator: null,
                        action: 'deactivate'
                      })}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant={statusChangeDialog.action === 'deactivate' ? 'destructive' : 'default'}
                    >
                      {statusChangeDialog.action === 'deactivate' ? 'Deactivate' : 'Activate'}
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