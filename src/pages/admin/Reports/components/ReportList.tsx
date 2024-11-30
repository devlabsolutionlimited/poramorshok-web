import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Report } from '../types';
import { getStatusColor, getRiskColor } from '../utils';

interface ReportListProps {
  reports: Report[];
  onViewReport: (report: Report) => void;
}

export default function ReportList({ reports, onViewReport }: ReportListProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Mentor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="capitalize">
                {report.type.replace('_', ' ')}
              </TableCell>
              <TableCell>{report.studentName}</TableCell>
              <TableCell>{report.mentorName}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={getRiskColor(report.riskScore || 0)}>
                  {report.riskScore}%
                </span>
              </TableCell>
              <TableCell>
                {new Date(report.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewReport(report)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}