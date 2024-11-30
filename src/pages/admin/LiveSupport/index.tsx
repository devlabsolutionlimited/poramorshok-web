import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '../Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Search, Bot, User, Clock, CheckCircle2 } from 'lucide-react';
import ChatWindow from './ChatWindow';
import ModeratorAccess from './ModeratorAccess';

// Mock data
const fetchChats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    chats: [
      {
        id: '1',
        userId: 'u1',
        userName: 'John Doe',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        status: 'active',
        lastMessage: 'I need help with booking a session',
        timestamp: new Date().toISOString(),
        unread: true,
        assignedTo: null
      },
      {
        id: '2',
        userId: 'u2',
        userName: 'Sarah Ahmed',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        status: 'resolved',
        lastMessage: 'Thank you for your help!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        unread: false,
        assignedTo: {
          id: 'm1',
          name: 'Support Agent'
        }
      }
    ],
    stats: {
      activeChats: 5,
      resolvedToday: 12,
      averageResponseTime: '2m',
      satisfaction: '95%'
    }
  };
};

export default function AdminLiveSupport() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-live-support'],
    queryFn: fetchChats
  });

  const handleSendMessage = async (content: string) => {
    try {
      // API call would go here
      console.log('Sending message:', { chatId: selectedChat?.id, content });
      
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleResolveChat = async (chatId: string) => {
    try {
      // API call would go here
      console.log('Resolving chat:', chatId);
      
      toast({
        title: 'Chat Resolved',
        description: 'The chat has been marked as resolved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve chat. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Live Support</h1>
            <p className="text-muted-foreground">
              Manage live support conversations and moderator access
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.activeChats}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.resolvedToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.averageResponseTime}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.satisfaction}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="chats" className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="chats">Active Chats</TabsTrigger>
                  <TabsTrigger value="moderators">Moderator Access</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chats">
                <div className="flex h-[600px] overflow-hidden">
                  {/* Chat List */}
                  <div className="w-80 border-r flex flex-col">
                    <div className="p-4 border-b">
                      <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                        prefix={<Search className="h-4 w-4 text-muted-foreground" />}
                      />
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="divide-y">
                        {data?.chats.map((chat) => {
                          const isSelected = selectedChat?.id === chat.id;
                          return (
                            <button
                              key={chat.id}
                              onClick={() => setSelectedChat(chat)}
                              className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                                isSelected ? 'bg-accent' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar>
                                    <AvatarImage src={chat.userAvatar} />
                                    <AvatarFallback>
                                      <User className="h-4 w-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                  {chat.unread && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium truncate">
                                      {chat.userName}
                                    </p>
                                    <Badge
                                      variant={chat.status === 'active' ? 'default' : 'secondary'}
                                    >
                                      {chat.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {chat.lastMessage}
                                  </p>
                                  {chat.assignedTo && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Assigned to: {chat.assignedTo.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Chat Window */}
                  <div className="flex-1">
                    {selectedChat ? (
                      <ChatWindow
                        chat={selectedChat}
                        onSendMessage={handleSendMessage}
                        onResolve={() => handleResolveChat(selectedChat.id)}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                        <MessageSquare className="h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Chat Selected</h3>
                        <p>Select a conversation from the list to start chatting</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="moderators">
                <ModeratorAccess />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}