import Sidebar from '@components/layout/Sidebar';
import Topbar from '@components/layout/Topbar';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 min-h-screen">
        <Topbar title={title} />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
