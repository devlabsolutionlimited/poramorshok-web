import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Shield } from 'lucide-react';

// Mock data
const fetchModerators = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    moderators: [
      {
        id: 'm1',
        name: 'John Smith',
        email: 'john@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        hasLiveSupportAccess: true,
        activeChats: 2,
        status: 'online'
      },
      {
        id: 'm2',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        hasLiveSupportAccess: false,
        activeChats: 0,
        status: 'offline'
      }
    ]
  };
};

export default function ModeratorAccess() {
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ['moderators-live-support'],
    queryFn: fetchModerators
  });

  const handleToggleAccess = async (moderatorId: string, hasAccess: boolean) => {
    try {
      // API call would go here
      console.log('Toggling access:', { moderatorId, hasAccess });
      
      toast({
        title: 'Access Updated',
        description: `Live support access has been ${hasAccess ? 'granted' : 'revoked'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update access. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {data?.moderators.map((moderator) => (
          <Card key={moderator.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={moderator.avatar} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{moderator.name}</h3>
                      <Badge variant={moderator.status === 'online' ? 'default' : 'secondary'}>
                        {moderator.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{moderator.email}</p>
                    {moderator.activeChats > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {moderator.activeChats} active chats
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Live Support Access</span>
                    <Switch
                      checked={moderator.hasLiveSupportAccess}
                      onCheckedChange={(checked) => handleToggleAccess(moderator.id, checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}