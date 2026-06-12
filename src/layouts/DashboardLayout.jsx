import Sidebar from '@components/layout/Sidebar';
import Topbar from '@components/layout/Topbar';

const DashboardLayout = ({ children, title, fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', width: '100%' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: '100vh',
        marginLeft: 0,
      }}
        className="dashboard-content"
      >
        <Topbar title={title} />
        <main style={{
          flex: 1,
          padding: '20px 16px',
          overflowX: 'hidden',
          width: '100%',
        }}
          className="dashboard-main"
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .dashboard-content { margin-left: 240px !important; }
          .dashboard-main { padding: 28px 28px !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
