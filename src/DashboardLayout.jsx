import React, { useState, useEffect } from 'react';

const DashboardLayout = ({ children, userRole, onLogout, activeTab, onTabChange }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const menu = userRole === 'Admin' 
    ? ['Dashboard', 'Project Registry', 'Students'] 
    : ['My Project', 'Grades', 'Submission'];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh' }}>
      <aside style={{
        width: isMobile ? '100%' : '260px',
        background: '#0f172a',
        padding: '24px',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ color: '#6366f1', fontSize: '22px', fontWeight: '900', marginBottom: isMobile ? 0 : '40px' }}>PROFLOW</div>
          <nav style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '10px' }}>
            {menu.map(item => (
              <div 
                key={item} 
                onClick={() => onTabChange(item)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  backgroundColor: activeTab === item ? '#6366f1' : 'transparent',
                  color: activeTab === item ? 'white' : '#94a3b8'
                }}
              >
                {item}
              </div>
            ))}
          </nav>
        </div>
        <button onClick={onLogout} style={{ padding: '10px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </aside>
      <main style={{ flex: 1, background: '#f8fafc', height: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;