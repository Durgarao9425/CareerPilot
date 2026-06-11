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
  { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/builder', icon: DocumentTextIcon, label: 'Resume Builder' },
  { to: '/ats', icon: ChartBarIcon, label: 'ATS Analyzer' },
  { to: '/cover-letters', icon: EnvelopeIcon, label: 'Cover Letters' },
  { to: '/job-matches', icon: BriefcaseIcon, label: 'Recommended Jobs' },
  { to: '/interview-prep', icon: QuestionMarkCircleIcon, label: 'Interview Prep' },
  { to: '/profile', icon: UserIcon, label: 'Profile' },
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-200 dark:border-surface-700">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-surface-900 dark:text-white text-base leading-tight flex items-center">
            CareerPilot<span className="text-primary-500 font-black ml-0.5">+</span>
          </h1>
          <span className="text-[10px] text-surface-500 font-medium uppercase tracking-wider">AI Career Assistant</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => dispatch(setSidebarOpen(false))}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-surface-200 dark:border-surface-700 space-y-1">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="nav-item w-full"
        >
          {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button onClick={handleLogout} className="nav-item w-full text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/30">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </button>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl bg-surface-100 dark:bg-surface-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                generateInitials(user.displayName || user.email)
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-surface-900 dark:text-white truncate">
                {user.displayName || 'User'}
              </p>
              <p className="text-xs text-surface-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 flex-shrink-0 fixed left-0 top-0 z-30">
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 w-64 h-screen bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 lg:hidden"
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
