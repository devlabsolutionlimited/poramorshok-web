import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Search, UserX, History, ArrowUpRight, Ban } from 'lucide-react';
import UserIncidentHistory from './UserIncidentHistory';

const defaultBlacklistedUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    reason: 'Multiple fraudulent refund requests',
    blacklistedAt: '2024-03-15T10:00:00Z',
    incidents: 5,
    status: 'permanent'
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    email: 'sarah@example.com',
    reason: 'Suspicious activity pattern',
    blacklistedAt: '2024-03-10T15:30:00Z',
    incidents: 3,
    status: 'temporary'
  }
];

export default function BlacklistedUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState(defaultBlacklistedUsers);
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleRemoveFromBlacklist = (userId: string) => {
    toast({
      title: 'User Removed',
      description: 'User has been removed from the blacklist.',
    });
  };

  const handleViewHistory = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search blacklisted users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blacklisted</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permanent Bans</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {users.filter(u => u.status === 'permanent').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Additions</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => {
                const date = new Date(u.blacklistedAt);
                const now = new Date();
                const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
                return daysDiff <= 7;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blacklisted Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Blacklisted Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-lg border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge
                      variant={user.status === 'permanent' ? 'destructive' : 'secondary'}
                    >
                      {user.status === 'permanent' ? 'Permanent Ban' : 'Temporary Ban'}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Reason: {user.reason}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Blacklisted on: {new Date(user.blacklistedAt).toLocaleDateString()}
                    </span>
                    <span className="text-muted-foreground">
                      {user.incidents} incidents reported
                    </span>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewHistory(user.id, user.name)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFromBlacklist(user.id)}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Remove from Blacklist
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* User Incident History Dialog */}
      {selectedUser && (
        <UserIncidentHistory
          userId={selectedUser.id}
          userName={selectedUser.name}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}