import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

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
      className: 'text-blue-500 animate-spin'
    },
    success: {
      icon: CheckCircle,
      title: 'Success',
      className: 'text-green-500'
    },
    error: {
      icon: XCircle,
      title: 'Error',
      className: 'text-red-500'
    }
  };

  const Icon = statusConfig[status].icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className={`h-6 w-6 ${statusConfig[status].className}`} />
          </div>
          <DialogTitle className="text-center pt-4">
            {statusConfig[status].title}
          </DialogTitle>
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