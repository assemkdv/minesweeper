'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CatMascot } from '@/components/CatMascot';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 9C3 5 6 3 9 3s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6z" stroke="#b5708a" strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="2.5" fill="#b5708a"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 9C3 5 6 3 9 3s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6z" stroke="#b5708a" strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="2.5" fill="#b5708a"/>
      <line x1="2" y1="2" x2="16" y2="16" stroke="#b5708a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function PawIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="5" r="1.5" fill="#ff85a1"/>
      <circle cx="8" cy="3.5" r="1.5" fill="#ff85a1"/>
      <circle cx="12" cy="5" r="1.5" fill="#ff85a1"/>
      <ellipse cx="8" cy="10" rx="4" ry="3.5" fill="#ff85a1"/>
      <circle cx="6" cy="9" r="1" fill="#ffd6e7"/>
      <circle cx="10" cy="9" r="1" fill="#ffd6e7"/>
    </svg>
  );
}

export default function SignInPage() {
  const [mode, setMode]         = useState<'signin'|'signup'>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setError('Auth coming soon! Connect Supabase to enable real sign-in.');
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px 16px',
    }}>
      {/* Back link */}
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <Link href="/" style={{
          color: 'var(--muted)', textDecoration: 'none', fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
      </div>

      {/* Card */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420,
        boxShadow: '0 16px 48px rgba(255,133,161,0.15)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      }}>

        {/* Cat mascot */}
        <div className="anim-float" style={{ marginBottom: 16 }}>
          <CatMascot mood="idle" size={88}/>
        </div>

        <h1 style={{ fontWeight: 900, fontSize: 24, color: 'var(--text)', marginBottom: 4, textAlign: 'center' }}>
          {mode === 'signin' ? 'Welcome back, nya~' : 'Join the fun, nya~'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 28, textAlign: 'center' }}>
          {mode === 'signin' ? 'Sign in to save your stats and streaks.' : 'Create an account to track your progress.'}
        </p>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: 4, marginBottom: 24, width: '100%',
        }}>
          {(['signin','signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '8px', borderRadius: 7, border: 'none',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
              background: mode === m ? 'var(--accent)' : 'transparent',
              color: mode === m ? '#fff' : 'var(--muted)',
              boxShadow: mode === m ? '0 3px 10px rgba(255,77,109,0.3)' : 'none',
            }}>
              {m === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
                border: '1.5px solid var(--border)', background: 'var(--bg)',
                color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#ff85a1'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '11px 42px 11px 14px', borderRadius: 10, fontSize: 14,
                  border: '1.5px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#ff85a1'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
              <button type="button" onClick={() => setShowPw(v=>!v)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0,
              }}>
                <EyeIcon open={showPw}/>
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fff5f7', border: '1px solid #ffc2d1',
              borderRadius: 8, padding: '9px 12px',
              fontSize: 13, color: '#ff4d6d', fontWeight: 500,
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            background: loading ? '#ffb3c6' : 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 10, padding: '12px',
            fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px rgba(255,77,109,0.35)', transition: 'transform 0.15s',
            marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
            onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.transform='translateY(-1px)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform='translateY(0)')}>
            {loading ? (
              <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }}/>
            ) : (
              <><PawIcon/> {mode === 'signin' ? 'Sign in' : 'Create account'}</>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', width: '100%' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        {/* Guest */}
        <Link href="/game" style={{
          display: 'block', width: '100%', padding: '11px',
          textAlign: 'center', borderRadius: 10, textDecoration: 'none',
          border: '1.5px solid var(--border)', color: 'var(--muted)',
          fontWeight: 700, fontSize: 14, transition: 'border-color 0.15s',
          boxSizing: 'border-box',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#ff85a1'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
          Continue as guest
        </Link>

        <p style={{ marginTop: 20, fontSize: 11, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
          Stats are saved locally in your browser even without an account.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
