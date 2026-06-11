import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import resumeReducer from '@features/resume/resumeSlice';
import atsReducer from '@features/ats/atsSlice';
import uiReducer from '@features/ui/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    ats: atsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

export default store;
