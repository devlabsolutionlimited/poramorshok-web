import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Ban, CheckCircle2 } from 'lucide-react';
import { Report } from './types';
import { getStatusColor } from './utils';
import FraudAnalysis from './FraudAnalysis';
import { calculateRiskScore } from '@/lib/fraud-detection';
import { analyzeReport } from '@/lib/report-analysis';

interface ReportDetailsProps {
  report: Report;
  onClose: () => void;
  onUpdateStatus: (reportId: string, newStatus: string) => void;
}

export default function ReportDetails({ 
  report, 
  onClose, 
  onUpdateStatus 
}: ReportDetailsProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Report Type</h3>
            <p className="text-muted-foreground capitalize">
              {report.type.replace('_', ' ')}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Status</h3>
            <Badge className={getStatusColor(report.status)}>
              {report.status}
            </Badge>
          </div>
          <div>
            <h3 className="font-medium">Session ID</h3>
            <p className="text-muted-foreground">#{report.sessionId}</p>
          </div>
          <div>
            <h3 className="font-medium">Created At</h3>
            <p className="text-muted-foreground">
              {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-muted-foreground">{report.description}</p>
        </div>

        <FraudAnalysis
          fraudDetection={calculateRiskScore(report.session, report.activityLogs)}
          reportAnalysis={analyzeReport(
            report.session,
            report.evidence,
            calculateRiskScore(report.session, report.activityLogs)
          )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {report.status === 'pending' && (
            <>
              <Button
                variant="destructive"
                onClick={() => onUpdateStatus(report.id, 'rejected')}
              >
                <Ban className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => onUpdateStatus(report.id, 'investigating')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Investigate
              </Button>
              <Button
                variant="default"
                onClick={() => onUpdateStatus(report.id, 'resolved')}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}