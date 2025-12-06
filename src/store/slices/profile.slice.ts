import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@/types/profile.types';

interface ProfileState {
  currentProfile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  currentProfile: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.currentProfile) {
        state.currentProfile = {
          ...state.currentProfile,
          ...action.payload,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.currentProfile = null;
      state.error = null;
    },
  },
});

export const { setProfile, updateProfile, setLoading, setError, clearProfile } =
  profileSlice.actions;

export default profileSlice.reducer;

