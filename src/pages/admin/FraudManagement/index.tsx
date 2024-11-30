import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '../Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/page-loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  TrendingUp,
  UserX,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import RiskAnalysis from './RiskAnalysis';
import FraudRules from './FraudRules';
import BlacklistedUsers from './BlacklistedUsers';
import RefundAnalysis from './RefundAnalysis';
import DisputeAnalysis from './DisputeAnalysis';
import SuspiciousActivity from './SuspiciousActivity';

// Mock API call
const fetchFraudStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    stats: {
      totalCases: 156,
      highRiskCases: 24,
      resolvedCases: 89,
      blacklistedUsers: 12,
      averageRiskScore: 42,
      recentIncidents: [
        {
          id: '1',
          type: 'multiple_refunds',
          userId: 'user_1',
          userName: 'John Doe',
          riskScore: 85,
          timestamp: '2024-03-20T10:00:00Z'
        },
        {
          id: '2',
          type: 'suspicious_activity',
          userId: 'user_2',
          userName: 'Sarah Ahmed',
          riskScore: 75,
          timestamp: '2024-03-19T15:30:00Z'
        }
      ],
      riskTrends: [
        { month: 'Jan', score: 35 },
        { month: 'Feb', score: 42 },
        { month: 'Mar', score: 38 }
      ]
    }
  };
};

export default function FraudManagement() {
  const { data, isLoading } = useQuery({
    queryKey: ['fraud-stats'],
    queryFn: fetchFraudStats
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Fraud Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage fraud detection system
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {data?.stats.highRiskCases}
              </div>
              <p className="text-xs text-muted-foreground">
                {((data?.stats.highRiskCases / data?.stats.totalCases) * 100).toFixed(1)}% of total cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {data?.stats.averageRiskScore}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blacklisted Users</CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.stats.blacklistedUsers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {data?.stats.resolvedCases}
              </div>
              <p className="text-xs text-muted-foreground">
                {((data?.stats.resolvedCases / data?.stats.totalCases) * 100).toFixed(1)}% resolution rate
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="risk-analysis" className="space-y-6">
              <TabsList>
                <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
                <TabsTrigger value="disputes">Disputes</TabsTrigger>
                <TabsTrigger value="suspicious">Suspicious Activity</TabsTrigger>
                <TabsTrigger value="fraud-rules">Fraud Rules</TabsTrigger>
                <TabsTrigger value="blacklist">Blacklisted Users</TabsTrigger>
              </TabsList>

              <TabsContent value="risk-analysis">
                <RiskAnalysis incidents={data?.stats.recentIncidents} trends={data?.stats.riskTrends} />
              </TabsContent>

              <TabsContent value="refunds">
                <RefundAnalysis />
              </TabsContent>

              <TabsContent value="disputes">
                <DisputeAnalysis />
              </TabsContent>

              <TabsContent value="suspicious">
                <SuspiciousActivity />
              </TabsContent>

              <TabsContent value="fraud-rules">
                <FraudRules />
              </TabsContent>

              <TabsContent value="blacklist">
                <BlacklistedUsers />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}