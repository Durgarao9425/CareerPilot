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
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
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
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontFamily: "'Inter', sans-serif",
          maxWidth: '380px',
          boxShadow: 'var(--shadow-hover)',
        },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        loading: { iconTheme: { primary: '#6c47ff', secondary: '#fff' } },
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
