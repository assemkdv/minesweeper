'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { loadStats, formatTime } from '@/lib/storage';
import { CatMascot } from '@/components/CatMascot';

function IconRobot() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="9" width="20" height="14" rx="4" fill="#ffc2d1"/>
      <rect x="8" y="12" width="4" height="4" rx="1" fill="#c9184a"/>
      <rect x="16" y="12" width="4" height="4" rx="1" fill="#c9184a"/>
      <rect x="11" y="17" width="6" height="2" rx="1" fill="#ff85a1"/>
      <rect x="12" y="5" width="4" height="4" rx="2" fill="#ffc2d1"/>
      <rect x="1" y="13" width="3" height="6" rx="1.5" fill="#ffd6e7"/>
      <rect x="24" y="13" width="3" height="6" rx="1.5" fill="#ffd6e7"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="7" width="22" height="18" rx="4" fill="#ffc2d1"/>
      <rect x="3" y="7" width="22" height="7" rx="4" fill="#ff85a1"/>
      <rect x="3" y="11" width="22" height="3" fill="#ff85a1"/>
      <rect x="8" y="3" width="3" height="6" rx="1.5" fill="#c9184a"/>
      <rect x="17" y="3" width="3" height="6" rx="1.5" fill="#c9184a"/>
      <rect x="8" y="18" width="3" height="3" rx="1" fill="#c9184a"/>
      <rect x="13" y="18" width="3" height="3" rx="1" fill="#c9184a"/>
      <rect x="18" y="18" width="3" height="3" rx="1" fill="#c9184a"/>
    </svg>
  );
}
function IconTrophy() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M8 4h12v10a6 6 0 01-12 0V4z" fill="#ffc2d1"/>
      <path d="M4 5h4v6a2 2 0 01-4 0V5z" fill="#ffd6e7"/>
      <path d="M20 5h4v6a2 2 0 01-4 0V5z" fill="#ffd6e7"/>
      <rect x="11" y="18" width="6" height="3" fill="#ff85a1"/>
      <rect x="8" y="21" width="12" height="3" rx="1.5" fill="#c9184a"/>
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="16" width="4" height="8" rx="2" fill="#ffc2d1"/>
      <rect x="12" y="10" width="4" height="14" rx="2" fill="#ff85a1"/>
      <rect x="20" y="6" width="4" height="18" rx="2" fill="#c9184a"/>
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L5 7v8c0 5 4 9 9 10 5-1 9-5 9-10V7L14 3z" fill="#ffc2d1"/>
      <path d="M10 13l3 3 5-5" stroke="#c9184a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconMobile() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="7" y="2" width="14" height="24" rx="3" fill="#ffc2d1"/>
      <rect x="9" y="5" width="10" height="16" rx="1" fill="white" fillOpacity="0.6"/>
      <circle cx="14" cy="23" r="1.5" fill="#c9184a"/>
    </svg>
  );
}

export default function HomePage() {
  const [isDark, setIsDark]   = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats]     = useState(() => loadStats());

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
    setStats(loadStats());
    setMounted(true);
  }, []);

  const toggle = () => {
    const n = !isDark;
    setIsDark(n);
    document.documentElement.classList.toggle('dark', n);
    localStorage.setItem('theme', n ? 'dark' : 'light');
  };

  const totalGames = (['beginner','intermediate','expert'] as const).reduce((s,d)=>s+stats[d].gamesPlayed,0);
  const totalWins  = (['beginner','intermediate','expert'] as const).reduce((s,d)=>s+stats[d].wins,0);

  const features = [
    { Icon: IconRobot,    title: 'AI Coach',        desc: 'Real-time probability overlay. Every hidden cell shows its mine risk so you never guess blindly.' },
    { Icon: IconCalendar, title: 'Daily Challenge',  desc: 'Same board for everyone worldwide, every day. Build streaks and race the clock.' },
    { Icon: IconTrophy,   title: 'Leaderboard',      desc: 'Compare your best times globally. See who is fastest.' },
    { Icon: IconChart,    title: 'Deep Stats',        desc: 'Win rate, streaks, best times — all tracked locally. No sign-up needed.' },
    { Icon: IconShield,   title: 'Always Fair',       desc: 'Mines are placed after your first click. First move is always safe, guaranteed.' },
    { Icon: IconMobile,   title: 'Works Everywhere',  desc: 'Mobile-friendly with long-press to flag. Plays great on phone, tablet, and desktop.' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>

      {/* Hero */}
      <section style={{ padding: '72px 24px 56px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div className="anim-float" style={{ display: 'inline-block', marginBottom: 16 }}>
          <CatMascot mood="idle" size={96}/>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem,6vw,3.6rem)', fontWeight: 900, letterSpacing: -1.5, marginBottom: 14, lineHeight: 1.1 }}>
          Minesweeper,<br/><span style={{ color: 'var(--accent)' }}>but smarter.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,2.5vw,1.15rem)', color: 'var(--muted)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
          An AI coach tells you exactly how risky each cell is.
          Daily challenges keep you coming back. Real stats track your growth.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/game" style={{
            background: 'var(--btn)', color: '#fff', padding: '13px 32px',
            borderRadius: 10, fontWeight: 800, fontSize: 16, textDecoration: 'none',
            boxShadow: '0 4px 16px var(--btn-shadow)', transition: 'transform 0.15s',
          }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='translateY(0)'}>
            Play Now
          </Link>
          <Link href="/daily" style={{
            background: 'var(--card)', color: 'var(--text)',
            padding: '13px 24px', borderRadius: 10, fontWeight: 700, fontSize: 16,
            textDecoration: 'none', border: '1px solid var(--border)',
          }}>
            Today&apos;s Puzzle
          </Link>
        </div>

        {mounted && totalGames > 0 && (
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {[
              { label: 'Games Played', value: totalGames },
              { label: 'Total Wins',   value: totalWins },
              { label: 'Win Rate',     value: `${totalGames ? Math.round(totalWins/totalGames*100) : 0}%` },
            ].map(({label,value}) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--btn)' }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section style={{ padding: '56px 24px', maxWidth: 1080, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Everything you need to get good</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: 36, fontSize: 14 }}>Not just another Minesweeper clone.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {features.map(({ Icon, title, desc }) => (
            <div key={title} style={{
              background: 'var(--card)', borderRadius: 16, padding: '22px',
              border: '1px solid var(--border)', transition: 'transform 0.2s',
            }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-3px)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='translateY(0)'}>
              <div style={{ marginBottom: 10 }}><Icon/></div>
              <h3 style={{ fontWeight: 800, color: 'var(--btn)', marginBottom: 6, fontSize: 16 }}>{title}</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: 13 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best times */}
      {mounted && (['beginner','intermediate','expert'] as const).some(d=>stats[d].bestTime) && (
        <section style={{ padding: '0 24px 56px', maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Your Best Times</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {(['beginner','intermediate','expert'] as const).map(d => (
              <div key={d} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>{d}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--btn)', marginTop: 4 }}>
                  {stats[d].bestTime ? formatTime(stats[d].bestTime!) : '—'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pro */}
      <section style={{
        background: 'var(--bg2)', borderTop: '1px solid var(--border)',
        padding: '52px 24px', textAlign: 'center',
      }}>
        <div style={{ display: 'inline-block', background: 'var(--btn)', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, marginBottom: 14 }}>Coming soon</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 10 }}>MinesweeperPro</h2>
        <p style={{ color: 'var(--muted)', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7, fontSize: 15 }}>
          Custom board themes, advanced AI analysis, leaderboard highlights — the full experience.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {['Custom themes','Advanced AI','Global leaderboard','No ads'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }}/>
              {f}
            </div>
          ))}
        </div>
        <button onClick={() => alert('Coming soon!')} style={{
          background: 'var(--btn)', color: '#fff', padding: '12px 32px',
          borderRadius: 10, fontWeight: 700, fontSize: 15,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 16px var(--btn-shadow)',
        }}>
          Join the waitlist
        </button>
      </section>

      <footer style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontSize: 13, borderTop: '1px solid var(--border)' }}>
        MinesweeperPro &copy; 2026
      </footer>
    </div>
  );
}
