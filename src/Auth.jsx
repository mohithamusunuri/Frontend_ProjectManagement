import React, { useState } from 'react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/${isLogin ? 'login' : 'signup'}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role }) 
        });

        if (response.ok) {
          const data = await response.json();
          onLoginSuccess(data.role);
        } else {
          const errorMsg = await response.text();
          alert(errorMsg || "Authentication Failed.");
        }
      } catch (err) {
        alert("Server Connection Error. Check if Spring Boot is running.");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleSocialLogin = (provider) => {
    window.location.href = provider === 'google' 
      ? 'https://accounts.google.com/o/oauth2/auth' 
      : 'https://github.com/login/oauth/authorize';
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.visualSide}>
        <div style={styles.imageOverlay}>
          <div style={styles.textContainer}>
            <h1 style={styles.brandTitle}>ProFlow <span style={{color: '#818cf8'}}>Portal</span></h1>
            <p style={styles.brandTagline}>Evaluate and track academic projects with precision and speed.</p>
          </div>
        </div>
      </div>

      <div style={styles.formSide}>
        <div style={styles.formWrapper}>
          <div style={styles.mobileLogo}>🚀 ProFlow</div>
          <h2 style={styles.heading}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={styles.subHeading}>
            {isLogin ? 'Sign in to access your dashboard' : 'Join the platform to start managing projects'}
          </p>

          {/* --- SOCIAL BUTTONS --- */}
          <div style={styles.socialGroup}>
            <button style={styles.socialBtn} onClick={() => handleSocialLogin('google')}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" style={{marginRight: '10px'}} alt="G"/>
              Google
            </button>
            <button style={styles.socialBtn} onClick={() => handleSocialLogin('github')}>
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="18" style={{marginRight: '10px'}} alt="GH"/>
              GitHub
            </button>
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or continue with email</span>
            <span style={styles.dividerLine}></span>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            
            {/* --- ROLE SELECTION (Appears only on Sign Up) --- */}
            {!isLogin && (
              <div style={styles.inputBox}>
                <label style={styles.label}>I am a:</label>
                <div style={styles.roleToggleGroup}>
                  <button 
                    type="button"
                    onClick={() => setRole('Student')}
                    style={{...styles.roleBtn, ...(role === 'Student' ? styles.roleBtnActive : {})}}
                  >
                    🎓 Student
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('Admin')}
                    style={{...styles.roleBtn, ...(role === 'Admin' ? styles.roleBtnActive : {})}}
                  >
                    👨‍🏫 Teacher
                  </button>
                </div>
              </div>
            )}

            <div style={styles.inputBox}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@university.com" 
                style={styles.input} 
                required
              />
            </div>

            <div style={styles.inputBox}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <label style={styles.label}>Password</label>
                {isLogin && <span style={styles.forgotPass}>Forgot?</span>}
              </div>
              <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  style={styles.input} 
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)} style={styles.togglePass}>
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p style={styles.switchText}>
            {isLogin ? "New here?" : "Already have an account?"} 
            <span onClick={() => setIsLogin(!isLogin)} style={styles.switchLink}>
              {isLogin ? ' Sign up for free' : ' Log in here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  authContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '"Inter", sans-serif' },
  visualSide: { flex: 1.2, backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', display: window.innerWidth < 1000 ? 'none' : 'flex' },
  imageOverlay: { width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' },
  textContainer: { textAlign: 'center', color: 'white' },
  brandTitle: { fontSize: '56px', fontWeight: '900', marginBottom: '20px' },
  brandTagline: { fontSize: '18px', opacity: 0.9, maxWidth: '350px', margin: '0 auto' },
  formSide: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  formWrapper: { width: '100%', maxWidth: '400px' },
  mobileLogo: { fontSize: '24px', fontWeight: 'bold', color: '#4f46e5', marginBottom: '40px' },
  heading: { fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '8px' },
  subHeading: { fontSize: '15px', color: '#6b7280', marginBottom: '24px' },
  socialGroup: { display: 'flex', gap: '12px', marginBottom: '24px' },
  socialBtn: { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  divider: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' },
  dividerLine: { flex: 1, height: '1px', background: '#f3f4f6' },
  dividerText: { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputBox: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  roleToggleGroup: { display: 'flex', gap: '10px', marginTop: '4px' },
  roleBtn: { flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  roleBtnActive: { borderColor: '#4f46e5', background: '#f5f3ff', color: '#4f46e5' },
  input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontSize: '16px', width: '100%', boxSizing: 'border-box' },
  togglePass: { position: 'absolute', right: '16px', fontSize: '12px', fontWeight: 'bold', color: '#4f46e5', cursor: 'pointer' },
  forgotPass: { fontSize: '13px', color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer' },
  submitBtn: { padding: '14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },
  switchText: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' },
  switchLink: { color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer' }
};

export default Auth;