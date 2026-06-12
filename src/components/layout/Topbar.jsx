import { useDispatch, useSelector } from 'react-redux';
import { Bars3Icon, BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toggleSidebar, selectDarkMode, toggleDarkMode } from '@features/ui/uiSlice';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { generateInitials } from '@utils/helpers';

const Topbar = ({ title }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      height: 60,
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      gap: 12,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="btn-ghost"
          style={{ padding: '7px', borderRadius: 'var(--radius-sm)', display: 'flex' }}
          aria-label="Toggle sidebar"
          id="topbar-menu-btn"
        >
          <Bars3Icon style={{ width: 20, height: 20 }} />
        </button>

        {title && (
          <h2 style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.2px',
          }}>
            {title}
          </h2>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link
          to="/builder"
          className="btn-primary btn-sm"
          style={{ display: 'none', borderRadius: 'var(--radius-md)' }}
          id="topbar-new-resume-btn"
        >
          <PlusIcon style={{ width: 15, height: 15 }} />
          New Resume
        </Link>

        {/* Dark mode */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="btn-ghost"
          style={{ padding: '7px', borderRadius: 'var(--radius-sm)', display: 'flex' }}
          aria-label="Toggle dark mode"
          id="topbar-theme-btn"
        >
          {darkMode
            ? <SunIcon style={{ width: 18, height: 18 }} />
            : <MoonIcon style={{ width: 18, height: 18 }} />
          }
        </button>

        {/* Notifications */}
        <button
          className="btn-ghost"
          style={{ padding: '7px', borderRadius: 'var(--radius-sm)', display: 'flex', position: 'relative' }}
          aria-label="Notifications"
          id="topbar-notifications-btn"
        >
          <BellIcon style={{ width: 18, height: 18 }} />
          <span style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--warning)',
            border: '1.5px solid var(--bg-card)',
          }} />
        </button>

        {/* Avatar */}
        {user && (
          <button
            onClick={() => navigate('/profile')}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand) 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              overflow: 'hidden',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: 'var(--shadow-btn)',
            }}
            id="topbar-avatar-btn"
          >
            {user.photoURL
              ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : generateInitials(user.displayName || user.email)
            }
          </button>
        )}
      </div>

      <style>{`
        @media (min-width: 640px) {
          #topbar-new-resume-btn { display: inline-flex !important; }
          #topbar-menu-btn { display: none; }
        }
        @media (min-width: 1024px) {
          #topbar-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Topbar;
