import React, { useState, useMemo } from 'react';
import axios from 'axios';
import Auth from './Auth';
import DashboardLayout from './DashboardLayout';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [subTab, setSubTab] = useState('Overview');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [githubInput, setGithubInput] = useState('');
  const [selections, setSelections] = useState({}); 

  // --- 1. TECHNICAL RUBRICS ---
  const rubricCriteria = [
    { id: 'fetch_axios', title: '4. Fetch/Axios Implementation', levels: [{lv:6,metric:'Proper async handling, reusable API services',weight:10},{lv:5,metric:'Mostly correct',weight:8},{lv:4,metric:'Basic API calls',weight:6},{lv:3,metric:'Inconsistent',weight:4},{lv:2,metric:'Poor',weight:2},{lv:1,metric:'None',weight:0}] },
    { id: 'auth', title: '5. Authentication (Login/Register)', levels: [{lv:6,metric:'Secure auth with validation & token handling',weight:10},{lv:5,metric:'Minor issues',weight:8},{lv:4,metric:'Basic auth',weight:6},{lv:3,metric:'Partial',weight:4},{lv:2,weight:2,metric:'Weak auth'},{lv:1,metric:'Not implemented',weight:0}] },
    { id: 'session', title: '6. Session Management', levels: [{lv:6,metric:'Proper session handling',weight:10},{lv:5,metric:'Good',weight:8},{lv:4,metric:'Basic session',weight:6},{lv:3,metric:'Partial',weight:4},{lv:2,metric:'Poor logic',weight:2},{lv:1,metric:'Not Implemented',weight:0}] },
    { id: 'crud', title: '7. CRUD Operations', levels: [{lv:6,metric:'Complete CRUD with validation & integration',weight:10},{lv:5,metric:'Mostly complete',weight:8},{lv:4,metric:'Basic CRUD',weight:6},{lv:3,metric:'Partial',weight:4},{lv:2,metric:'Limited',weight:2},{lv:1,metric:'None',weight:0}] },
    { id: 'api_integration', title: '8. API Integration (Response & Exception Handling)', levels: [{lv:6,metric:'Full integration with exception handling',weight:10},{lv:5,metric:'Minor issues',weight:8},{lv:4,metric:'Basic',weight:6},{lv:3,metric:'Partial',weight:4},{lv:2,metric:'Poor',weight:2},{lv:1,metric:'None',weight:0}] },
    { id: 'git_usage', title: '9. Git Usage & Repository Management', levels: [{lv:6,metric:'Proper Git usage (commits, history visible)',weight:10},{lv:5,metric:'Good history',weight:8},{lv:4,metric:'Basic commits',weight:6},{lv:3,metric:'Few commits',weight:4},{lv:2,metric:'Minimal',weight:2},{lv:1,metric:'None',weight:0}] },
    { id: 'teamwork', title: '10. Team Coordination', levels: [{lv:6,metric:'Excellent teamwork, equal contribution',weight:10},{lv:5,metric:'Good collaboration',weight:8},{lv:4,metric:'Average',weight:6},{lv:3,metric:'Uneven',weight:4},{lv:2,metric:'Poor teamwork',weight:2},{lv:1,metric:'No coordination',weight:0}] }
  ];

  // --- 2. MASTER DATA GENERATOR ---
  const studentDirectory = useMemo(() => {
    const prefixes = ["2400030", "2400031", "2400032", "2400033"];
    let students = [{ id: "2400031772", name: "M.Mohitha" }]; 
    prefixes.forEach(p => {
      for (let i = 0; i <= 24; i++) {
        const id = `${p}${i.toString().padStart(3, '0')}`;
        if (id !== "2400031772") students.push({ id, name: `Student ${id.slice(-4)}` });
      }
    });
    return students;
  }, []);

  const projectList = useMemo(() => [
    "AI Health Monitor", "Smart City Traffic", "E-Learning System", "Blockchain Voting", "IoT Agriculture", "Attendance API Tracker"
  ], []);

  const [assignments, setAssignments] = useState([
    { id: 'GP-01', project: 'AI Health Monitor', members: ['2400031772', '2400031005'], grades: null, github: '' }
  ]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  // --- 3. SYSTEM LOGIC ---
  const toggleStudent = (id) => {
    setSelectedStudents(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= 3) { alert("Max 3 members per team."); return prev; } 
      return [...prev, id];
    });
  };

  const publishGrade = () => {
    const total = Object.values(selections).reduce((acc, curr) => acc + curr.weight, 0);
    setAssignments(prev => prev.map(g => g.id === selectedGroup.id ? { ...g, grades: selections, total } : g));
    alert("Technical Evaluation Published Successfully!");
    setSelectedGroup(null); setSelections({});
  };

  if (!user) return <Auth onLoginSuccess={(role) => setUser({ role, id: '2400031772' })} />;
  const myGroup = assignments.find(g => g.members.includes(user.id));

  return (
    <DashboardLayout userRole={user.role} onLogout={() => setUser(null)} activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setSubTab('Overview'); }}>
      <div style={styles.pageWrapper}>
        
        {/* --- 1. FACULTY PANEL (ADMIN) --- */}
        {user.role === 'Admin' && activeTab === 'Dashboard' && (
          <div style={styles.flexCol}>
            <header style={{borderBottom: '2px solid #e11d48', paddingBottom: '10px'}}><h1 style={styles.title}>Faculty Panel</h1></header>
            <div style={styles.card}>
              <div style={styles.allocationGrid}>
                <div style={styles.flexCol}>
                  <h3 style={styles.secTitle}>1. Project Allocation</h3>
                  <select style={styles.input} value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                    <option value="">-- Choose Project --</option>
                    {projectList.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button onClick={() => {
                    if (selectedStudents.length && selectedProject) {
                      setAssignments([{ id: `GP-${assignments.length+1}`, project: selectedProject, members: [...selectedStudents], grades: null, github: '' }, ...assignments]);
                      setSelectedStudents([]); setSelectedProject('');
                    }
                  }} style={styles.submitBtn}>Assign Team</button>
                </div>
                <div style={styles.flexCol}>
                  <h3 style={styles.secTitle}>2. Team Selection ({selectedStudents.length}/3)</h3>
                  <div style={styles.scrollArea}>
                    <div style={styles.badgeGrid}>
                      {studentDirectory.map(s => (
                        <div key={s.id} onClick={() => toggleStudent(s.id)} style={{...styles.badge, backgroundColor: selectedStudents.includes(s.id) ? '#e11d48' : '#fff', color: selectedStudents.includes(s.id) ? '#fff' : '#3f3f46', border: selectedStudents.includes(s.id) ? '1px solid #e11d48' : '1px solid #e4e4e7', opacity: selectedStudents.length >= 3 && !selectedStudents.includes(s.id) ? 0.4 : 1}}>
                          {s.id}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead><tr style={styles.thRow}><th>Group</th><th>Project</th><th>Submission</th><th>Action</th></tr></thead>
                <tbody>{assignments.map(g => (
                  <tr key={g.id} style={styles.tr}>
                    <td style={{padding: '12px'}}><b>{g.id}</b></td><td>{g.project}</td>
                    <td style={{color: '#e11d48'}}>{g.github ? 'Link Active' : 'Pending'}</td>
                    <td><button style={styles.actionBtn} onClick={() => setSelectedGroup(g)}>Grade</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 2. PROJECT REGISTRY --- */}
        {activeTab === 'Project Registry' && (
          <div style={styles.flexCol}>
            <header style={{borderBottom: '2px solid #e11d48', paddingBottom: '10px'}}><h1 style={styles.title}>Project Registry</h1></header>
            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead style={styles.thRow}><tr><th>Use Case Title</th><th>Status</th><th>Members</th></tr></thead>
                    <tbody>{projectList.map((p, i) => {
                      const assign = assignments.find(a => a.project === p);
                      return (<tr key={i} style={styles.tr}><td style={{padding:'12px'}}>{p}</td><td>{assign ? 'ALLOCATED' : 'AVAILABLE'}</td><td>{assign?.members.join(', ') || '--'}</td></tr>)
                    })}</tbody>
                </table>
            </div>
          </div>
        )}

        {/* --- 3. STUDENTS LIST --- */}
        {activeTab === 'Students' && (
          <div style={styles.flexCol}>
            <header style={{borderBottom: '2px solid #e11d48', paddingBottom: '10px'}}><h1 style={styles.title}>Student Directory</h1></header>
            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead style={styles.thRow}><tr><th>ID</th><th>Name</th><th>Status</th></tr></thead>
                    <tbody>{studentDirectory.map(s => (
                      <tr key={s.id} style={styles.tr}><td style={{padding:'12px'}}>{s.id}</td><td>{s.name}</td><td>{assignments.some(a => a.members.includes(s.id)) ? 'Assigned' : 'Unassigned'}</td></tr>
                    ))}</tbody>
                </table>
            </div>
          </div>
        )}

        {/* --- 4. STUDENT MODULE (PRESERVED) --- */}
        {user.role === 'Student' && (
          <div style={styles.flexCol}>
            <header style={styles.header}>
              <h1 style={styles.title}>{subTab === 'Overview' ? activeTab : `${activeTab} > ${subTab}`}</h1>
              {subTab !== 'Overview' && <button onClick={() => setSubTab('Overview')} style={styles.backBtn}>← Back to Overview</button>}
            </header>

            {activeTab === 'Dashboard' && (
              subTab === 'Overview' ? (
                <div style={styles.allocationGrid}>
                  <div style={styles.card}>
                    <h3 style={styles.secTitle}>Project Lifecycle</h3>
                    <div style={styles.actionTileNav} onClick={() => setSubTab('Tasks')}>📋 View Tasks & Rubrics</div>
                    <div style={styles.actionTileNav} onClick={() => setSubTab('Status')}>🔄 Update Development Status</div>
                    
                    {/* NEW: SUBMISSION NAV TILE */}
                    <div style={styles.actionTileNav} onClick={() => setActiveTab('Submission')}>📤 Artifact Submission</div>
                  </div>
                  <div style={styles.card}>
                    <h3 style={styles.secTitle}>Assignment</h3>
                    <h2 style={{color: '#e11d48'}}>{myGroup?.project || 'Pending'}</h2>
                    <p style={{fontSize: '13px', color: '#71717a'}}>Group ID: {myGroup?.id || 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <div style={styles.card}>
                  {subTab === 'Tasks' && rubricCriteria.map(r => <div key={r.id} style={styles.taskItem}>- {r.title}</div>)}
                  {subTab === 'Status' && (
                    <div>
                      <h3 style={styles.secTitle}>Development Status</h3>
                      <select style={styles.input}><option>In Progress</option><option>Beta Phase</option><option>Completed</option></select>
                    </div>
                  )}
                </div>
              )
            )}

            {/* UPDATED: SUBMISSION VIEW WITH GITHUB LINK */}
            {activeTab === 'Submission' && (
              <div style={styles.card}>
                <h3 style={styles.secTitle}>GitHub Artifact Submission</h3>
                <p style={{fontSize:'12px', color:'#71717a', marginBottom:'15px'}}>Link your repository for review. This link will be visible to the Faculty panel.</p>
                <div style={{display:'flex', gap:'10px'}}>
                  <input 
                    style={styles.input} 
                    placeholder="https://github.com/your-username/repo" 
                    value={githubInput} 
                    onChange={e => setGithubInput(e.target.value)} 
                  />
                  <button onClick={() => {
                    if(githubInput.includes("github.com")) {
                      setAssignments(prev => prev.map(g => g.members.includes(user.id) ? {...g, github: githubInput} : g));
                      alert("Submission Successfully Linked!");
                    } else { alert("Please provide a valid GitHub link."); }
                  }} style={styles.submitBtn}>Link Repository</button>
                </div>
                {myGroup?.github && (
                  <div style={{marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0'}}>
                    <strong style={{fontSize: '13px'}}>Active Link:</strong> <a href={myGroup.github} target="_blank" style={{color: '#e11d48'}}>{myGroup.github}</a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Grades' && (
              <div style={styles.card}>
                <h3 style={styles.secTitle}>Grade Card</h3>
                {myGroup?.grades ? (
                  <div><div style={styles.totalBox}>Technical Score: {myGroup.total}/70</div>
                  {rubricCriteria.map(c => (
                    <div key={c.id} style={styles.studentGradeRow}>
                      <div style={{display:'flex', justifyContent:'space-between'}}><strong>{c.title}</strong><span>{myGroup.grades[c.id]?.weight}/10</span></div>
                      <div style={styles.barBase}><div style={{...styles.barFill, width: `${(myGroup.grades[c.id]?.weight / 10) * 100}%`}} /></div>
                    </div>
                  ))}</div>
                ) : <p style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>Evaluation Results Pending Faculty Review.</p>}
              </div>
            )}
          </div>
        )}

        {/* --- REVIEW RUBRICS MODAL --- */}
        {selectedGroup && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.modalHeader}>TECHNICAL EVALUATION : {selectedGroup.id}</div>
                <div style={styles.modalBody}>
                    <p style={{fontSize: '12px', marginBottom: '15px'}}><b>Artifact:</b> {selectedGroup.github ? <a href={selectedGroup.github} target="_blank">{selectedGroup.github}</a> : "No link submitted"}</p>
                    {rubricCriteria.map((criteria) => (
                      <div key={criteria.id} style={{marginBottom:'25px'}}>
                        <h4 style={{color:'#e11d48', fontSize:'13px', marginBottom:'8px'}}>{criteria.title}</h4>
                        <table style={styles.rubricTable}>
                          <thead><tr><th>Lv</th><th>Metric</th><th>Weight</th><th>Select</th></tr></thead>
                          <tbody>{criteria.levels.map((level) => (
                              <tr key={level.lv}>
                                <td style={{textAlign:'center'}}>{level.lv}</td>
                                <td>{level.metric}</td>
                                <td style={{textAlign:'center'}}>{level.weight}</td>
                                <td style={{textAlign:'center'}}><input type="radio" name={criteria.id} checked={selections[criteria.id]?.lv === level.lv} onChange={() => setSelections({...selections, [criteria.id]: level})}/></td>
                              </tr>
                            ))}</tbody>
                        </table>
                      </div>
                    ))}
                </div>
                <div style={styles.modalFooter}>
                    <button onClick={() => setSelectedGroup(null)} style={styles.cancelBtn}>Cancel</button>
                    <button onClick={publishGrade} style={styles.submitBtn}>Publish marks</button>
                </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  pageWrapper: { padding: '20px', background: '#f4f4f5', minHeight: '100vh' },
  title: { fontSize: '20px', fontWeight: 'bold', color: '#18181b', margin: 0 },
  flexCol: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { background: '#fff', padding: '25px', borderRadius: '4px', border: '1px solid #e4e4e7' },
  allocationGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  secTitle: { fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '15px' },
  input: { padding: '12px', border: '1px solid #e4e4e7', borderRadius: '4px', width: '100%' },
  submitBtn: { background: '#e11d48', color: '#fff', padding: '12px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  scrollArea: { height: '250px', overflowY: 'auto', background: '#fafafa', padding: '15px', border: '1px solid #f4f4f5' },
  badgeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' },
  badge: { padding: '8px', fontSize: '11px', textAlign: 'center', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' },
  tableCard: { background: '#fff', border: '1px solid #e4e4e7', borderRadius: '4px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  thRow: { background: '#f4f4f5', textAlign: 'left', color: '#71717a' },
  tr: { borderBottom: '1px solid #f4f4f5' },
  actionBtn: { background: '#e11d48', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', width: '90%', maxWidth: '1000px', height: '85vh', display: 'flex', flexDirection: 'column' },
  modalHeader: { background: '#e11d48', color: '#fff', padding: '15px', fontWeight: 'bold', textAlign: 'center' },
  modalBody: { padding: '20px', overflowY: 'auto', flex: 1 },
  rubricTable: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', border: '1px solid #f4f4f5' },
  modalFooter: { padding: '15px', borderTop: '1px solid #e4e4e7', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  cancelBtn: { background: '#71717a', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '4px', cursor: 'pointer' },
  totalBox: { background: '#fef2f2', padding: '15px', color: '#991b1b', fontWeight: 'bold', borderRadius: '4px', marginBottom: '15px' },
  barBase: { width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '10px', marginTop: '5px' },
  barFill: { height: '100%', background: '#e11d48', borderRadius: '10px' },
  studentGradeRow: { padding: '10px 0', borderBottom: '1px solid #f4f4f5' },
  actionTileNav: { padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #e11d48', color: '#e11d48', cursor: 'pointer', fontWeight: '700', marginBottom: '10px' },
  taskItem: { padding: '10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' },
  backBtn: { background: '#71717a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }
};

export default App;