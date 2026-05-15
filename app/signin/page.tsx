'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CatMascot } from '@/components/CatMascot';
import { supabase } from '@/lib/supabase';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 9C3 5 6 3 9 3s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6z" stroke="#9a4060" strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="2.5" fill="#9a4060"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 9C3 5 6 3 9 3s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6z" stroke="#9a4060" strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="2.5" fill="#9a4060"/>
      <line x1="2" y1="2" x2="16" y2="16" stroke="#9a4060" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function friendlyError(msg: string): string {
  if (msg.includes('already registered') || msg.includes('already been registered')) return 'An account with this email already exists.';
  if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) return 'Wrong email or password.';
  if (msg.includes('Email not confirmed')) return 'Please confirm your email first — check your inbox.';
  if (msg.includes('Password should be')) return 'Password must be at least 6 characters.';
  if (msg.includes('Unable to validate email')) return 'Please enter a valid email address.';
  return 'Something went wrong. Please try again.';
}

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode]         = useState<'signin'|'signup'>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(friendlyError(err.message)); setLoading(false); return; }
      setSuccess('Account created! Check your email to confirm, then sign in.');
      setMode('signin');
      setLoading(false);
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(friendlyError(err.message)); setLoading(false); return; }
      router.push('/game');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <Link href="/" style={{
          color: 'var(--muted)', textDecoration: 'none',
          fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
      </div>

      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420,
        boxShadow: '0 16px 48px rgba(201,24,74,0.1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div className="anim-float" style={{ marginBottom: 16 }}>
          <CatMascot mood="idle" size={88}/>
        </div>

        <h1 style={{ fontWeight: 900, fontSize: 24, color: 'var(--text)', marginBottom: 4, textAlign: 'center' }}>
          {mode === 'signin' ? 'Welcome back, nya~' : 'Join the fun, nya~'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 28, textAlign: 'center' }}>
          {mode === 'signin' ? 'Sign in to save your stats and streaks.' : 'Create an account to track your progress.'}
        </p>

        <div style={{
          display: 'flex', background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 10, padding: 4, marginBottom: 24, width: '100%',
        }}>
          {(['signin','signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }} style={{
              flex: 1, padding: '8px', borderRadius: 7, border: 'none',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
              background: mode === m ? 'var(--btn)' : 'transparent',
              color:      mode === m ? '#fff' : 'var(--muted)',
              boxShadow:  mode === m ? '0 2px 8px var(--btn-shadow)' : 'none',
            }}>
              {m === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label htmlFor="email" style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Email</label>
            <input
              id="email" name="email" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
                border: '1.5px solid var(--border)', background: 'var(--bg)',
                color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--btn)'}
              onBlur={e  => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password" name="password"
                type={showPw ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                style={{
                  width: '100%', padding: '11px 42px 11px 14px', borderRadius: 10, fontSize: 14,
                  border: '1.5px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--btn)'}
                onBlur={e  => e.currentTarget.style.borderColor = 'var(--border)'}
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
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--btn)', fontWeight: 500 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#166534', fontWeight: 500 }}>
              {success}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: loading ? 'var(--accent)' : 'var(--btn)',
            color: '#fff', border: 'none', borderRadius: 10, padding: '13px',
            fontSize: 15, fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px var(--btn-shadow)',
            marginTop: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {loading
              ? <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
              : mode === 'signin' ? 'Sign in' : 'Create account'
            }
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', width: '100%' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        <Link href="/game" style={{
          display: 'block', width: '100%', padding: '11px',
          textAlign: 'center', borderRadius: 10, textDecoration: 'none',
          border: '1.5px solid var(--border)', color: 'var(--muted)',
          fontWeight: 700, fontSize: 14, boxSizing: 'border-box',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--btn)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
          Continue as guest
        </Link>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
