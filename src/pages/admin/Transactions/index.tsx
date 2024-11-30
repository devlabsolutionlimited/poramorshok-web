import { useState } from 'react';
import AdminLayout from '../Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, RefreshCcw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import WithdrawalRequests from './WithdrawalRequests';
import RefundRequests from './RefundRequests';

const stats = [
  {
    title: 'Total Withdrawals',
    value: '৳150,000',
    description: 'This month',
    icon: ArrowUpRight,
    change: '+12%',
    trend: 'up'
  },
  {
    title: 'Pending Withdrawals',
    value: '৳45,000',
    description: '8 requests',
    icon: Wallet,
    change: '+3',
    trend: 'up'
  },
  {
    title: 'Total Refunds',
    value: '৳25,000',
    description: 'This month',
    icon: ArrowDownRight,
    change: '-5%',
    trend: 'down'
  },
  {
    title: 'Pending Refunds',
    value: '৳12,000',
    description: '5 requests',
    icon: RefreshCcw,
    change: '+2',
    trend: 'up'
  }
];

export default function AdminTransactions() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions Management</h1>
            <p className="text-muted-foreground">
              Manage withdrawal and refund requests
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-sm">
                    <span className={`${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="withdrawals" className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="withdrawals" className="relative">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <span>Withdrawal Requests</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="refunds">
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      <span>Refund Requests</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="withdrawals" className="space-y-4">
                <WithdrawalRequests />
              </TabsContent>

              <TabsContent value="refunds" className="space-y-4">
                <RefundRequests />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}