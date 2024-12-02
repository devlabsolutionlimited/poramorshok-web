import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'loading' | 'success' | 'error';
  title?: string;
  message?: string;
}

export function StatusModal({ 
  isOpen, 
  onClose, 
  status, 
  title, 
  message 
}: StatusModalProps) {
  const statusConfig = {
    loading: {
      icon: Loader2,
      title: title || 'Processing',
      message: message || 'Please wait while we process your request...',
      color: 'text-blue-500',
      showClose: false
    },
    success: {
      icon: CheckCircle,
      title: title || 'Success',
      message: message || 'Operation completed successfully.',
      color: 'text-green-500',
      showClose: true
    },
    error: {
      icon: XCircle,
      title: title || 'Error',
      message: message || 'An error occurred. Please try again.',
      color: 'text-red-500',
      showClose: true
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={config.showClose ? onClose : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className={`h-6 w-6 ${config.color} ${status === 'loading' ? 'animate-spin' : ''}`} />
          </div>
          <DialogTitle className="text-center">{config.title}</DialogTitle>
          <DialogDescription className="text-center">
            {config.message}
          </DialogDescription>
        </DialogHeader>
        {config.showClose && (
          <div className="mt-4 flex justify-center">
            <Button onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}