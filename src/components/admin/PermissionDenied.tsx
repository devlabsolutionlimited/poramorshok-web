import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function PermissionDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">
            You don't have permission to access this feature. Please contact an administrator if you believe this is an error.
          </p>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Return to Dashboard
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}