import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface RefundDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  session: {
    id: string;
    amount: number;
    description: string;
    cancellationReason?: string;
  } | null;
  onConfirm: () => void;
}

export default function RefundDialog({
  isOpen,
  onOpenChange,
  session,
  onConfirm
}: RefundDialogProps) {
  if (!session) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Refund Terms & Conditions
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="mt-4 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="font-medium text-yellow-800 mb-2">Please note:</div>
            <div className="text-sm text-yellow-800">
              <ul className="list-disc list-inside space-y-1">
                <li>A 5% processing fee will be deducted from your refund amount</li>
                <li>Refund processing takes up to 7 business days</li>
                <li>The refund will be credited to your original payment method</li>
              </ul>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <div>
              <div className="font-medium mb-1">Cancellation Reason:</div>
              <div className="text-sm text-muted-foreground">
                {session.cancellationReason}
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Refund Summary:</div>
              <div className="text-sm space-y-1">
                <div>Original Amount: ৳{session.amount}</div>
                <div>Processing Fee (5%): ৳{session.amount * 0.05}</div>
                <div className="font-medium text-base mt-2">
                  Final Refund Amount: ৳{session.amount * 0.95}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Proceed with Refund
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}