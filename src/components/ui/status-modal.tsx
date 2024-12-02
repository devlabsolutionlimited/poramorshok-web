import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'loading' | 'success' | 'error';
  message?: string;
}

export function StatusModal({ isOpen, onClose, status, message }: StatusModalProps) {
  const statusConfig = {
    loading: {
      icon: Loader2,
      title: 'Processing',
      color: 'text-blue-500',
      animation: 'animate-spin'
    },
    success: {
      icon: CheckCircle2,
      title: 'Success',
      color: 'text-green-500'
    },
    error: {
      icon: AlertCircle,
      title: 'Error',
      color: 'text-red-500'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className={`h-6 w-6 ${config.color} ${config.animation || ''}`} />
          </div>
          <DialogTitle className="text-center">{config.title}</DialogTitle>
          {message && (
            <DialogDescription className="text-center">
              {message}
            </DialogDescription>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}