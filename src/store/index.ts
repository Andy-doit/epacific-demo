import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profile.slice';
import employeeReducer from './slices/employee.slice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    employee: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

