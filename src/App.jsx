import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from '@store/store';
import AppRouter from '@routes/AppRouter';
import ErrorBoundary from '@components/ui/ErrorBoundary';
import { onAuthChange } from '@fb/auth';
import { setUser, clearUser } from '@features/auth/authSlice';
import { selectDarkMode } from '@features/ui/uiSlice';

const AuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsub();
  }, [dispatch]);

  return null;
};

const DarkModeInitializer = () => {
  const darkMode = useSelector(selectDarkMode);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  return null;
};

const AppInner = () => (
  <>
    <AuthListener />
    <DarkModeInitializer />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--toast-bg, #1e293b)',
          color: '#f1f5f9',
          border: '1px solid #334155',
          borderRadius: '12px',
          fontSize: '14px',
          maxWidth: '380px',
        },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        loading: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
      }}
    />
    <AppRouter />
  </>
);

const App = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
);

export default App;
