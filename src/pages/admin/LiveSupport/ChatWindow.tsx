import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, CheckCircle2 } from 'lucide-react';

interface ChatWindowProps {
  chat: any;
  onSendMessage: (content: string) => void;
  onResolve: () => void;
}

export default function ChatWindow({ chat, onSendMessage, onResolve }: ChatWindowProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={chat.userAvatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{chat.userName}</h3>
              <Badge variant={chat.status === 'active' ? 'default' : 'secondary'}>
                {chat.status}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onResolve}
            disabled={chat.status === 'resolved'}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Resolved
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Mock messages - replace with actual messages */}
          <div className="flex items-start gap-3">
            <Avatar className="mt-1">
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <p>Hello! How can I help you today?</p>
              <span className="text-xs text-muted-foreground">10:00 AM</span>
            </div>
          </div>

          <div className="flex items-start gap-3 flex-row-reverse">
            <Avatar className="mt-1">
              <AvatarImage src={chat.userAvatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
              <p>{chat.lastMessage}</p>
              <span className="text-xs opacity-70">10:05 AM</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={chat.status === 'resolved'}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || chat.status === 'resolved'}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}