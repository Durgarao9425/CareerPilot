import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoadingScreen from '@components/ui/LoadingScreen';

// Lazy loaded pages
const Landing = lazy(() => import('@pages/Landing'));
const Login = lazy(() => import('@pages/Login'));
const Register = lazy(() => import('@pages/Register'));
const ForgotPassword = lazy(() => import('@pages/ForgotPassword'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const ResumeBuilder = lazy(() => import('@pages/ResumeBuilder'));
const ATSAnalyzer = lazy(() => import('@pages/ATSAnalyzer'));
const CoverLetters = lazy(() => import('@pages/CoverLetters'));
const InterviewPrep = lazy(() => import('@pages/InterviewPrep'));
const JobMatches = lazy(() => import('@pages/JobMatches'));
const Profile = lazy(() => import('@pages/Profile'));

const AppRouter = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
      <Route path="/builder/:resumeId" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
      <Route path="/ats" element={<ProtectedRoute><ATSAnalyzer /></ProtectedRoute>} />
      <Route path="/cover-letters" element={<ProtectedRoute><CoverLetters /></ProtectedRoute>} />
      <Route path="/job-matches" element={<ProtectedRoute><JobMatches /></ProtectedRoute>} />
      <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
