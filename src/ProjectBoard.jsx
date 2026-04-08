import React from 'react';

const ProjectBoard = () => {
  // Static data for the board
  const columns = [
    { title: 'To Do', color: '#f59e0b', tasks: ['Database Design', 'Auth Setup'] },
    { title: 'In Progress', color: '#3b82f6', tasks: ['Frontend UI'] },
    { title: 'Done', color: '#10b981', tasks: ['Project Setup'] }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      {columns.map(col => (
        <div key={col.title} style={{ background: '#fff', padding: '20px', borderRadius: '12px', borderTop: `4px solid ${col.color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', color: '#64748b' }}>{col.title.toUpperCase()}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {col.tasks.map(task => (
              <div key={task} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}>
                {task}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectBoard;