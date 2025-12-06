import { apiClient } from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Profile, UpdateProfilePayload } from '@/types/profile.types';

export const profileService = {
  /**
   * Get profile information
   * @returns Promise<Profile[]> - Array of profile information
   */
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<Profile[]>(API_ENDPOINTS.PROFILE.GET);
    // API returns array, we take the first item
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error('No profile data found');
  },

  /**
   * Update profile information
   * @param id - Profile ID
   * @param payload - Profile update data
   * @returns 
   */
  updateProfile: async (
    id: string,
    payload: UpdateProfilePayload
  ): Promise<Profile> => {
    const response = await apiClient.put<Profile>(
      API_ENDPOINTS.PROFILE.UPDATE(id),
      payload
    );
    return response.data;
  },
};

