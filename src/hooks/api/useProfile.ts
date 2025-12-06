import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import type { UpdateProfilePayload } from '@/types/profile.types';
import { toast } from 'sonner';

const PROFILE_QUERY_KEY = ['profile'] as const;

/**
 * Hook to fetch profile data
 */
export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to update profile data
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProfilePayload }) =>
      profileService.updateProfile(id, payload),
    onSuccess: (data) => {
      // Update cache with new data
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
      // Invalidate to refetch if needed
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success('Profile updated successfully', {
        description: 'Your profile information has been saved.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to update profile', {
        description: error.message || 'Something went wrong. Please try again.',
      });
    },
  });
};

