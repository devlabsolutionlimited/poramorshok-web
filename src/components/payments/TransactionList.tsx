import { format } from 'date-fns';
import { CheckCircle2, Ban, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: string;
  sessionStatus: 'completed' | 'cancelled' | 'pending';
  description: string;
  type: string;
  sessionId: string;
  cancellationReason?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isStudent?: boolean;
  onRefundRequest?: (transaction: Transaction) => void;
}

export default function TransactionList({ 
  transactions, 
  isStudent,
  onRefundRequest 
}: TransactionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                {transaction.sessionStatus === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : transaction.sessionStatus === 'cancelled' ? (
                  <Ban className="h-5 w-5 text-red-500" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(transaction.date), 'PPP')}
                  </div>
                  {transaction.sessionStatus === 'cancelled' && (
                    <div className="text-sm text-red-600">
                      Cancelled: {transaction.cancellationReason}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium">৳{transaction.amount}</div>
                  <div className={`text-sm capitalize ${
                    transaction.sessionStatus === 'completed' ? 'text-green-600' : 
                    transaction.sessionStatus === 'cancelled' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {transaction.sessionStatus}
                  </div>
                </div>
                {isStudent && 
                 transaction.sessionStatus === 'cancelled' && 
                 transaction.status === 'completed' && 
                 transaction.type === 'payment' && 
                 onRefundRequest && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => onRefundRequest(transaction)}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Request Refund
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}