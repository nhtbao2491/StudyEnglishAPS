import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

function OAuthButtons({ onOAuth }) {
  return (
    <div className={styles.oauthBtns}>
      <button type="button" className={styles.oauthBtn} onClick={() => onOAuth('Google')}>
        <GoogleIcon /> Google
      </button>
      <button type="button" className={styles.oauthBtn} onClick={() => onOAuth('GitHub')}>
        <GitHubIcon /> GitHub
      </button>
    </div>
  );
}

function Tabs({ active, setView }) {
  return (
    <div className={styles.tabs}>
      <button className={`${styles.tab} ${active === 'login' ? styles.tabActive : ''}`} onClick={() => setView('login')}>
        Sign In
      </button>
      <button className={`${styles.tab} ${active === 'register' ? styles.tabActive : ''}`} onClick={() => setView('register')}>
        Create Account
      </button>
    </div>
  );
}

function LeftPanel() {
  return (
    <div className={styles.leftPanel}>
      <div className={styles.deco}>
        <div className={styles.decoCircle1} />
        <div className={styles.decoCircle2} />
      </div>
      <div className={styles.brand}>
        <div className={styles.logo}>📚</div>
        <h1 className={styles.brandName}>VocabList</h1>
        <p className={styles.brandSub}>Your personal English vocabulary tracker</p>
      </div>
      <div className={styles.featureList}>
        {[
          { icon: '📖', title: 'Smart Vocab Library',  desc: 'Organize words by topic & priority' },
          { icon: '✏️', title: 'Interactive Quizzes',  desc: 'Test yourself with adaptive flashcards' },
          { icon: '📊', title: 'Progress Tracking',    desc: 'Weekly & monthly review reports' },
        ].map((f, i) => (
          <div className={styles.featureItem} key={i}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <div className={styles.featureText}>
              <p>{f.title}</p>
              <span>{f.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.bird}>🐦</div>
    </div>
  );
}

// ══════════════════════════════════
//  Root
// ══════════════════════════════════
export default function Login() {
  const [view, setView] = useState('login');

  const handleOAuth = (provider) => {
    alert(`OAuth with ${provider} — connect your auth provider`);
  };

  return (
    <div className={styles.container}>
      <LeftPanel />
      <div className={styles.rightPanel}>
        <div className={styles.card}>
          {view === 'login'       && <SignInView     setView={setView} onOAuth={handleOAuth} />}
          {view === 'register'    && <RegisterView   setView={setView} onOAuth={handleOAuth} />}
          {view === 'forgot'      && <ForgotView     setView={setView} />}
          {view === 'forgot-sent' && <ForgotSentView setView={setView} />}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════
//  View 1 — Sign In
// ══════════════════════════════════
function SignInView({ setView, onOAuth }) {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Email hoặc mật khẩu không đúng.');
  };

  return (
    <>
      <div className={styles.cardHeader}>
        <h2>Welcome back! 👋</h2>
        {/* subtitle đã bỏ */}
      </div>

      <Tabs active="login" setView={setView} />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Email</label>
          <input type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <div className={styles.pwWrap}>
            <input
              type={showPw ? 'text' : 'password'} placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
            <button type="button" className={styles.pwToggle} onClick={() => setShowPw(v => !v)}>
              {showPw ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <div className={styles.forgotRow}>
          <button type="button" className={styles.linkBtn} onClick={() => setView('forgot')}>
            Forgot password?
          </button>
        </div>

        {error && <div className={styles.error}>⚠️ {error}</div>}

        <button type="submit" className={styles.btnMain} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : 'Sign In →'}
        </button>

        <div className={styles.divider}>or continue with</div>
      </form>

      <p className={styles.footerLink}>
        No account?{' '}
        <button type="button" className={styles.linkBtn} onClick={() => setView('register')}>Sign up free</button>
      </p>
      <div className={styles.hintBox}>💡 Demo: nhập bất kỳ email &amp; password</div>
    </>
  );
}

// ══════════════════════════════════
//  View 2 — Register
// ══════════════════════════════════
function RegisterView({ setView, onOAuth }) {
  const [username,  setUsername]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [agreed,    setAgreed]    = useState(false);
  const [strength,  setStrength]  = useState(0);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const SL = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const SC = ['', '#e87878', '#e8c84a', '#7bbcf0', '#3da876'];

  const calcStrength = (val) => {
    let s = 0;
    if (val.length >= 8)          s++;
    if (/[A-Z]/.test(val))        s++;
    if (/[0-9]/.test(val))        s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    return s;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!agreed)                { setError('Vui lòng đồng ý Terms of Service.'); return; }
    if (password !== confirmPw) { setError('Mật khẩu xác nhận không khớp.'); return; }
    if (password.length < 8)    { setError('Mật khẩu tối thiểu 8 ký tự.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    alert('🎉 Tạo tài khoản thành công!');
    setView('login');
  };

  return (
    <>
      <div className={styles.cardHeader}>
        <h2>Create account ✨</h2>
        {/* subtitle đã bỏ */}
      </div>

      <Tabs active="register" setView={setView} />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Username</label>
          <input type="text" placeholder="e.g. vocablearner99"
            value={username} onChange={e => setUsername(e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <div className={styles.pwWrap}>
            <input
              type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
              value={password}
              onChange={e => { setPassword(e.target.value); setStrength(calcStrength(e.target.value)); }}
              required
            />
            <button type="button" className={styles.pwToggle} onClick={() => setShowPw(v => !v)}>
              {showPw ? '🙈' : '👁'}
            </button>
          </div>
          {password && (
            <>
              <div className={styles.strengthBar}>
                <div className={styles.strengthFill}
                  style={{ width: `${strength * 25}%`, background: SC[strength] }} />
              </div>
              <span className={styles.strengthLabel} style={{ color: SC[strength] }}>
                {SL[strength]}
              </span>
            </>
          )}
        </div>

        <div className={styles.field}>
          <label>Confirm Password</label>
          <div className={styles.pwWrap}>
            <input type="password" placeholder="Repeat password"
              value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
          </div>
        </div>

        <label className={styles.checkRow}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          <span className={styles.terms}>
            I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
          </span>
        </label>

        {error && <div className={styles.error}>⚠️ {error}</div>}

        <button type="submit" className={styles.btnMain} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : 'Create Account 🚀'}
        </button>

        <div className={styles.divider}>or sign up with</div>
        <OAuthButtons onOAuth={onOAuth} />
      </form>

      <p className={styles.footerLink}>
        Have an account?{' '}
        <button type="button" className={styles.linkBtn} onClick={() => setView('login')}>Sign in</button>
      </p>
    </>
  );
}

// ══════════════════════════════════
//  View 3 — Forgot Password
// ══════════════════════════════════
function ForgotView({ setView }) {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    setView('forgot-sent');
  };

  return (
    <>
      <button type="button" className={styles.backBtn} onClick={() => setView('login')}>
        ← Back to Sign In
      </button>
      <div className={styles.cardHeader}>
        <h2>Forgot password? 🔑</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Email address</label>
          <input type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <button type="submit" className={styles.btnMain} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : 'Send Reset Link'}
        </button>
      </form>
      <p className={styles.footerLink} style={{ marginTop: 14 }}>
        Remember it?{' '}
        <button type="button" className={styles.linkBtn} onClick={() => setView('login')}>Sign in</button>
      </p>
    </>
  );
}

// ══════════════════════════════════
//  View 4 — Forgot Sent
// ══════════════════════════════════
function ForgotSentView({ setView }) {
  return (
    <>
      <button type="button" className={styles.backBtn} onClick={() => setView('login')}>
        ← Back to Sign In
      </button>
      <div className={styles.cardHeader}>
        <h2>Check your email 📬</h2>
      </div>
      <div className={styles.successBox}>
        <div className={styles.successIcon}>✅</div>
        <p>We've sent a password reset link to your email address.</p>
        <small>
          Didn't receive it?{' '}
          <button type="button" className={styles.linkBtn} onClick={() => setView('forgot')}>Try again</button>
        </small>
      </div>
      <button type="button" className={styles.btnMain} style={{ marginTop: 16 }} onClick={() => setView('login')}>
        Back to Sign In
      </button>
    </>
  );
}