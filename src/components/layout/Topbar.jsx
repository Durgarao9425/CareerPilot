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
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="btn-ghost p-2 rounded-xl lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
        {title && (
          <h2 className="text-base font-semibold text-surface-900 dark:text-white font-display hidden sm:block">
            {title}
          </h2>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Link
          to="/builder"
          className="btn-primary btn-sm hidden sm:inline-flex rounded-full px-4"
        >
          <PlusIcon className="w-4 h-4" />
          New Resume
        </Link>

        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="btn-ghost p-2 rounded-xl"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>

        <button className="btn-ghost p-2 rounded-xl relative" aria-label="Notifications">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
        </button>

        {user && (
          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden"
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              generateInitials(user.displayName || user.email)
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
