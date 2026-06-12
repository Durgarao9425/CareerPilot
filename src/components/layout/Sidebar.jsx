import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon, DocumentTextIcon, ChartBarIcon, EnvelopeIcon,
  QuestionMarkCircleIcon, UserIcon, SunIcon, MoonIcon,
  ArrowRightOnRectangleIcon, SparklesIcon, BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { toggleDarkMode, selectDarkMode, selectSidebarOpen, setSidebarOpen } from '@features/ui/uiSlice';
import { clearUser } from '@features/auth/authSlice';
import { logoutUser } from '@fb/auth';
import { useAuth } from '@hooks/useAuth';
import { generateInitials } from '@utils/helpers';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard',      icon: HomeIcon,                  label: 'Dashboard' },
  { to: '/builder',        icon: DocumentTextIcon,          label: 'Resume Builder' },
  { to: '/ats',            icon: ChartBarIcon,              label: 'ATS Analyzer' },
  { to: '/cover-letters',  icon: EnvelopeIcon,              label: 'Cover Letters' },
  { to: '/job-matches',    icon: BriefcaseIcon,             label: 'Recommended Jobs' },
  { to: '/interview-prep', icon: QuestionMarkCircleIcon,    label: 'Interview Prep' },
  { to: '/profile',        icon: UserIcon,                  label: 'Profile' },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector(selectDarkMode);
  const sidebarOpen = useSelector(selectSidebarOpen);
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser());
      toast.success('Signed out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const renderSidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Logo ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Icon mark */}
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'linear-gradient(135deg, var(--brand) 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-btn)',
          flexShrink: 0,
          fontSize: 18,
          color: 'white',
          fontWeight: 700,
          letterSpacing: '-1px',
        }}>
          ✦
        </div>

        {/* Text */}
        <div>
          <p style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            letterSpacing: '-0.3px',
          }}>
            CareerPilot
          </p>
          <p style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--brand)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: 1,
          }}>
            AI ASSISTANT
          </p>
        </div>
      </div>

      {/* ── Nav Items ── */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => dispatch(setSidebarOpen(false))}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span style={{ fontSize: 14 }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom section ── */}
      <div style={{
        padding: '8px 8px 12px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        {/* Dark mode toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="nav-item"
          style={{ width: '100%', textAlign: 'left' }}
        >
          {darkMode
            ? <SunIcon style={{ width: 18, height: 18 }} />
            : <MoonIcon style={{ width: 18, height: 18 }} />
          }
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', textAlign: 'left', color: 'var(--danger)' }}
        >
          <ArrowRightOnRectangleIcon style={{ width: 18, height: 18 }} />
          <span>Sign Out</span>
        </button>

        {/* User card */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--brand-light)',
            marginTop: 4,
          }}>
            {/* Avatar */}
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand) 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
              overflow: 'hidden',
            }}>
              {user.photoURL
                ? <img src={user.photoURL} alt={user.displayName || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : generateInitials(user.displayName || user.email)
              }
            </div>

            {/* Name + plan */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user.displayName || 'User'}
              </p>
              <p style={{
                fontSize: 11,
                color: 'var(--brand)',
                fontWeight: 500,
                marginTop: 1,
              }}>
                Free Plan
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        display: 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        width: 240,
        height: '100vh',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        flexDirection: 'column',
        zIndex: 30,
        flexShrink: 0,
      }}
        className="lg-sidebar"
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(setSidebarOpen(false))}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 40,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
              }}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 50,
                width: 240,
                height: '100vh',
                background: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border)',
              }}
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CSS for desktop sidebar visibility */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
