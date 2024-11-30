import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageLoader } from '@/components/ui/page-loader';
import ChatWindow from '@/components/messaging/ChatWindow';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Conversation, Message } from '@/types/message';

// Mock data (same as before)
const mockConversations = [/* ... */];
const mockMessages = {/* ... */};
const mockUsers = {/* ... */};

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockConversations;
    }
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMessages[selectedConversation] || [];
    },
    enabled: !!selectedConversation
  });

  const filteredConversations = conversations?.filter(conversation => {
    const otherParticipantId = conversation.participants.find(id => id !== user?.id);
    const otherParticipant = otherParticipantId ? mockUsers[otherParticipantId] : null;
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: user.id,
      receiverId: conversations?.find(c => c.id === selectedConversation)?.participants.find(id => id !== user.id) || '',
      content,
      createdAt: new Date().toISOString(),
      read: false
    };

    console.log('Sending message:', newMessage);
  };

  if (isLoadingConversations) {
    return <PageLoader />;
  }

  const getOtherParticipant = (conversation: Conversation) => {
    const otherParticipantId = conversation.participants.find(id => id !== user?.id);
    return otherParticipantId ? mockUsers[otherParticipantId] : null;
  };

  // Show mobile chat view
  if (showMobileChat && selectedConversation) {
    return (
      <div className="h-[calc(100vh-10rem)]">
        <Button
          variant="ghost"
          className="md:hidden mb-4"
          onClick={() => {
            setShowMobileChat(false);
            setSelectedConversation(null);
          }}
        >
          ← Back to conversations
        </Button>
        <ChatWindow
          recipientId={conversations?.find(c => c.id === selectedConversation)?.participants.find(id => id !== user?.id) || ''}
          recipientName={getOtherParticipant(conversations?.find(c => c.id === selectedConversation)!)?.name || ''}
          recipientAvatar={getOtherParticipant(conversations?.find(c => c.id === selectedConversation)!)?.avatar}
          messages={messages || []}
          onSendMessage={handleSendMessage}
          isLoading={isLoadingMessages}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] bg-background rounded-lg border">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r flex flex-col">
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
              {filteredConversations?.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                if (!otherParticipant) return null;

                const isSelected = selectedConversation === conversation.id;
                const hasUnread = conversation.unreadCount > 0;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation.id);
                      setShowMobileChat(true);
                    }}
                    className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                      isSelected ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={otherParticipant.avatar}
                          alt={otherParticipant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {hasUnread && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{otherParticipant.name}</p>
                          {conversation.lastMessage && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage.content}
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
        <div className="hidden md:flex flex-1">
          {selectedConversation && conversations ? (
            <ChatWindow
              recipientId={conversations.find(c => c.id === selectedConversation)?.participants.find(id => id !== user?.id) || ''}
              recipientName={getOtherParticipant(conversations.find(c => c.id === selectedConversation)!)?.name || ''}
              recipientAvatar={getOtherParticipant(conversations.find(c => c.id === selectedConversation)!)?.avatar}
              messages={messages || []}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingMessages}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
              <MessageSquare className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Conversation Selected</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}