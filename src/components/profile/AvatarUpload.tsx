import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string;
  name: string;
  onUpload: (file: File) => Promise<void>;
}

export default function AvatarUpload({ currentAvatar, name, onUpload }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(file);
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile picture',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={currentAvatar} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="relative">
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('avatar-upload')?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </>
          )}
        </Button>
      </div>
    </div>
  );
}