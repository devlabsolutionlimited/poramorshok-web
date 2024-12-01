import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';

import type { Transaction } from '@/types/payment';

interface TransactionHistoryProps {
  transactions?: Transaction[];
}

export default function TransactionHistory({ transactions = [] }: TransactionHistoryProps) {
  if (!transactions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'earning'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {transaction.type === 'earning' ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transaction.date), 'PPP')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === 'earning' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {transaction.type === 'earning' ? '+' : '-'}৳{transaction.amount}
                </p>
                <p className={`text-sm ${
                  transaction.status === 'completed'
                    ? 'text-green-600'
                    : transaction.status === 'processing'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {transaction.status === 'processing' && (
                    <Clock className="h-3 w-3 inline-block mr-1" />
                  )}
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}