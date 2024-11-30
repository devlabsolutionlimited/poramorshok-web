import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, Info, Clock, Shield, FileCheck } from 'lucide-react';
import type { FraudDetectionResult } from '@/lib/fraud-detection';
import type { ReportAnalysis } from '@/lib/report-analysis';

interface FraudAnalysisProps {
  fraudDetection: FraudDetectionResult;
  reportAnalysis: ReportAnalysis;
}

export default function FraudAnalysis({ 
  fraudDetection, 
  reportAnalysis 
}: FraudAnalysisProps) {
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCredibilityColor = (score: number) => {
    if (score > 70) return 'text-green-500';
    if (score > 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.startsWith('Approve')) return CheckCircle;
    if (recommendation.startsWith('Reject')) return XCircle;
    return AlertTriangle;
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                <p className={`text-2xl font-bold ${getRiskColor(fraudDetection.riskScore)}`}>
                  {fraudDetection.riskScore}%
                </p>
              </div>
              <Shield className={`h-8 w-8 ${getRiskColor(fraudDetection.riskScore)}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Credibility</p>
                <p className={`text-2xl font-bold ${getCredibilityColor(reportAnalysis.overallCredibility)}`}>
                  {reportAnalysis.overallCredibility}%
                </p>
              </div>
              <FileCheck className={`h-8 w-8 ${getCredibilityColor(reportAnalysis.overallCredibility)}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Timeline Accuracy</p>
                <p className={`text-2xl font-bold ${getCredibilityColor(reportAnalysis.timelineAccuracy)}`}>
                  {reportAnalysis.timelineAccuracy}%
                </p>
              </div>
              <Clock className={`h-8 w-8 ${getCredibilityColor(reportAnalysis.timelineAccuracy)}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment and Credibility */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Risk Score</span>
                <span className={getRiskColor(fraudDetection.riskScore)}>
                  {fraudDetection.riskScore}%
                </span>
              </div>
              <Progress 
                value={fraudDetection.riskScore} 
                className={`h-2 ${getRiskColor(fraudDetection.riskScore)}`}
              />
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {fraudDetection.flags.map((flag, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Risk Flag</AlertTitle>
                      <AlertDescription>{flag}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Credibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Overall Credibility</span>
                <span className={getCredibilityColor(reportAnalysis.overallCredibility)}>
                  {reportAnalysis.overallCredibility}%
                </span>
              </div>
              <Progress 
                value={reportAnalysis.overallCredibility}
                className={`h-2 ${getCredibilityColor(reportAnalysis.overallCredibility)}`}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Consistency</p>
                  <p className="text-lg font-semibold">{reportAnalysis.consistencyScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Evidence Strength</p>
                  <p className="text-lg font-semibold">{reportAnalysis.evidenceStrength}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence and Recommendations */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evidence Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {Object.entries(fraudDetection.evidence).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded-lg border">
                    <span className="capitalize flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                      {key.replace(/_/g, ' ')}
                    </span>
                    {value ? (
                      <Badge variant="success" className="bg-green-100 text-green-800">Available</Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">Missing</Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              {(() => {
                const Icon = getRecommendationIcon(reportAnalysis.recommendation);
                return (
                  <>
                    <Icon className="h-4 w-4" />
                    <AlertTitle>Recommended Action</AlertTitle>
                    <AlertDescription>{reportAnalysis.recommendation}</AlertDescription>
                  </>
                );
              })()}
            </Alert>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Analysis Flags</h4>
              <ScrollArea className="h-[120px] pr-4">
                <div className="space-y-2">
                  {reportAnalysis.flags.map((flag, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg border">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{flag}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}