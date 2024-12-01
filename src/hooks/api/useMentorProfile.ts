import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMentorProfile, 
  updateBasicInfo,
  updateExpertise,
  updateEducation,
  updateSocialLinks,
  updateCustomUrl,
  updateAvatar
} from '@/lib/api/profile';
import { useToast } from '@/hooks/use-toast';

export function useMentorProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const profileQuery = useQuery({
    queryKey: ['mentor-profile'],
    queryFn: getMentorProfile,
    staleTime: 0, // Always fetch fresh data
    retry: 3
  });

  const updateBasicInfoMutation = useMutation({
    mutationFn: updateBasicInfo,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['mentor-profile'] });
      const previousProfile = queryClient.getQueryData(['mentor-profile']);
      queryClient.setQueryData(['mentor-profile'], (old: any) => ({
        ...old,
        ...newData
      }));
      return { previousProfile };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-profile'] });
      toast({
        title: 'Profile Updated',
        description: 'Your basic information has been updated successfully.',
      });
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['mentor-profile'], context.previousProfile);
      }
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  });

  const updateExpertiseMutation = useMutation({
    mutationFn: updateExpertise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-profile'] });
      toast({
        title: 'Expertise Updated',
        description: 'Your expertise has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update expertise',
        variant: 'destructive',
      });
    }
  });

  const updateEducationMutation = useMutation({
    mutationFn: updateEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-profile'] });
      toast({
        title: 'Education Updated',
        description: 'Your education details have been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update education',
        variant: 'destructive',
      });
    }
  });

  const updateSocialLinksMutation = useMutation({
    mutationFn: updateSocialLinks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-profile'] });
      toast({
        title: 'Social Links Updated',
        description: 'Your social links have been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update social links',
        variant: 'destructive',
      });
    }
  });

  const updateCustomUrlMutation = useMutation({
    mutationFn: updateCustomUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-profile'] });
      toast({
        title: 'Custom URL Updated',
        description: 'Your profile URL has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update custom URL',
        variant: 'destructive',
      });
    }
  });

  const updateAvatarMutation = useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-profile'] });
      toast({
        title: 'Avatar Updated',
        description: 'Your profile photo has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile photo',
        variant: 'destructive',
      });
    }
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateBasicInfo: updateBasicInfoMutation.mutate,
    updateExpertise: updateExpertiseMutation.mutate,
    updateEducation: updateEducationMutation.mutate,
    updateSocialLinks: updateSocialLinksMutation.mutate,
    updateCustomUrl: updateCustomUrlMutation.mutate,
    updateAvatar: updateAvatarMutation.mutate,
    isUpdating: 
      updateBasicInfoMutation.isPending ||
      updateExpertiseMutation.isPending ||
      updateEducationMutation.isPending ||
      updateSocialLinksMutation.isPending ||
      updateCustomUrlMutation.isPending ||
      updateAvatarMutation.isPending
  };
}