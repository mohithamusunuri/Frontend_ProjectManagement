import React, { useState } from 'react';
import api from './api'; // Import our clean API tool

const TaskSubmission = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    if (!repoUrl) return alert("Please enter a URL");
    
    try {
      setStatus('Submitting...');
      // This sends the data to your Java backend
      await api.post('/submissions', { url: repoUrl });
      setStatus('Success! Project submitted.');
      setRepoUrl('');
    } catch (error) {
      setStatus('Error connecting to server.');
      console.error(error);
    }
  };

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 10px 0' }}>Submit Group Work</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="GitHub Link..."
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
        />
        <button 
          onClick={handleSubmit}
          style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Submit
        </button>
      </div>
      {status && <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>{status}</p>}
    </div>
  );
};

export default TaskSubmission;