import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { Permission } from '@/lib/permissions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: Permission;
  tooltipText?: string;
  children: React.ReactNode;
}

export default function ActionButton({ 
  permission, 
  tooltipText = "You don't have permission to perform this action",
  children,
  ...props 
}: ActionButtonProps) {
  const { hasPermission } = useAdmin();
  const canPerformAction = hasPermission(permission);

  if (!canPerformAction) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button {...props} disabled className="opacity-50">
                {children}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <Button {...props}>{children}</Button>;
}