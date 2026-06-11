import { useSelector } from 'react-redux';
import { selectUser, selectAuthLoading, selectIsAuthenticated } from '@features/auth/authSlice';

export const useAuth = () => {
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return { user, loading, isAuthenticated };
};
