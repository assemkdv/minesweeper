'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CatMascot } from '@/components/CatMascot';

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" fill="#ff85a1"/>
      {[0,45,90,135,180,225,270,315].map(a => (
        <line key={a}
          x1={8 + 4.5*Math.cos(a*Math.PI/180)} y1={8 + 4.5*Math.sin(a*Math.PI/180)}
          x2={8 + 6.5*Math.cos(a*Math.PI/180)} y2={8 + 6.5*Math.sin(a*Math.PI/180)}
          stroke="#ff85a1" strokeWidth="1.5" strokeLinecap="round"/>
      ))}
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 9A6 6 0 016 3a6 6 0 100 10 6 6 0 007-4z" fill="#ff85a1"/>
    </svg>
  );
}

export function Navbar({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const p = usePathname();
  const links = [
    { href: '/game',        label: 'Play' },
    { href: '/daily',       label: 'Daily' },
    { href: '/leaderboard', label: 'Scores' },
  ];
  return (
    <nav style={{
      background: 'var(--card)', borderBottom: '1px solid var(--border)',
      padding: '0 24px', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Link href="/" style={{
        fontWeight: 800, fontSize: 17, color: 'var(--text)',
        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <CatMascot mood="idle" size={34}/>
        MinesweeperPro
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {links.map(({ href, label }) => {
          const active = p === href || p?.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s',
              color: active ? 'var(--accent)' : 'var(--muted)',
              background: active ? 'rgba(255,77,109,0.09)' : 'transparent',
            }}>{label}</Link>
          );
        })}
        <Link href="/signin" style={{
          padding: '5px 14px', borderRadius: 8, fontSize: 14, fontWeight: 700,
          textDecoration: 'none', transition: 'all 0.15s',
          color: '#fff', background: 'var(--accent)',
          marginLeft: 4,
        }}>Sign in</Link>
        <button onClick={onToggleTheme} style={{
          marginLeft: 6, width: 34, height: 34, borderRadius: 8,
          border: '1px solid var(--border)', background: 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg2)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
          {isDark ? <SunIcon/> : <MoonIcon/>}
        </button>
      </div>
    </nav>
  );
}
