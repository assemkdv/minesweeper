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

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5.5 1l1.1 2.7L9.5 4l-2 2 .5 3-2.5-1.5L3 9l.5-3-2-2 2.9-.3L5.5 1z"
        fill="currentColor"/>
    </svg>
  );
}

export function Navbar({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const p = usePathname();
  const links = [
    { href: '/',            label: 'Home' },
    { href: '/game',        label: 'Play' },
    { href: '/daily',       label: 'Daily' },
    { href: '/leaderboard', label: 'Scores' },
  ];
  const proActive = p === '/pro';
  return (
    <nav style={{
      background: 'var(--card)', borderBottom: '1px solid var(--border)',
      padding: '0 24px', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Link href="/" style={{
        fontWeight: 900, fontSize: 20, color: 'var(--text)',
        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
        letterSpacing: -0.5,
      }}>
        <CatMascot mood="idle" size={34}/>
        Mineko
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {links.map(({ href, label }) => {
          const active = href === '/' ? p === '/' : (p === href || p?.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s',
              color: active ? 'var(--btn)' : 'var(--muted)',
              background: active ? 'rgba(201,24,74,0.09)' : 'transparent',
            }}>{label}</Link>
          );
        })}

        <Link href="/pro" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 800,
          textDecoration: 'none', marginLeft: 2,
          background: proActive
            ? 'linear-gradient(135deg, #ff4d6d 0%, #ff9a3c 100%)'
            : 'linear-gradient(135deg, rgba(255,77,109,0.12) 0%, rgba(255,154,60,0.12) 100%)',
          border: '1.5px solid',
          borderColor: proActive ? 'transparent' : 'rgba(255,77,109,0.3)',
          color: proActive ? '#fff' : '#e8185a',
          boxShadow: proActive ? '0 2px 10px rgba(255,77,109,0.35)' : 'none',
          transition: 'all 0.15s',
        }}>
          <StarIcon/>
          Pro
        </Link>

        <Link href="/signin" style={{
          padding: '6px 16px', borderRadius: 8, fontSize: 14, fontWeight: 700,
          textDecoration: 'none', color: '#fff',
          background: 'var(--btn)', marginLeft: 6,
          boxShadow: '0 2px 8px var(--btn-shadow)',
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
