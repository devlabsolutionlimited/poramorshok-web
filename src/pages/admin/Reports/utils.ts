export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'investigating':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getRiskColor = (score: number) => {
  if (score < 30) return 'text-green-500';
  if (score < 70) return 'text-yellow-500';
  return 'text-red-500';
};

export const filterReports = (
  reports: any[],
  searchQuery: string,
  statusFilter: string
) => {
  return reports.filter(report => {
    const matchesSearch = 
      report.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.sessionId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
};