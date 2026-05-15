'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
      <path d="M5.5 1l1.1 2.7L9.5 4l-2 2 .5 3-2.5-1.5L3 9l.5-3-2-2 2.9-.3L5.5 1z" fill="currentColor"/>
    </svg>
  );
}

export function Navbar({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const p = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // close menu on route change
  useEffect(() => { setMenuOpen(false); }, [p]);

  const links = [
    { href: '/',            label: 'Home',   exact: true },
    { href: '/game',        label: 'Play',   exact: false },
    { href: '/daily',       label: 'Daily',  exact: false },
    { href: '/leaderboard', label: 'Scores', exact: false },
  ];
  const proActive = p === '/pro';

  return (
    <nav style={{
      background: 'var(--card)', borderBottom: '1px solid var(--border)',
      padding: '0 16px', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontWeight: 900, fontSize: 20, color: 'var(--text)',
        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
        letterSpacing: -0.5,
      }}>
        <CatMascot mood="idle" size={34}/>
        Mineko
      </Link>

      {/* Desktop links */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {links.map(({ href, label, exact }) => {
            const active = exact ? p === href : (p === href || p?.startsWith(href));
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
            background: proActive ? 'linear-gradient(135deg,#ff4d6d,#ff9a3c)' : 'linear-gradient(135deg,rgba(255,77,109,0.12),rgba(255,154,60,0.12))',
            border: '1.5px solid', borderColor: proActive ? 'transparent' : 'rgba(255,77,109,0.3)',
            color: proActive ? '#fff' : '#e8185a',
            boxShadow: proActive ? '0 2px 10px rgba(255,77,109,0.35)' : 'none',
          }}>
            <StarIcon/> Pro
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
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg2)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            {isDark ? <SunIcon/> : <MoonIcon/>}
          </button>
        </div>
      )}

      {/* Mobile right side */}
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={onToggleTheme} style={{
            width: 34, height: 34, borderRadius: 8,
            border: '1px solid var(--border)', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isDark ? <SunIcon/> : <MoonIcon/>}
          </button>
          <button onClick={() => setMenuOpen(o => !o)} style={{
            width: 34, height: 34, borderRadius: 8,
            border: '1px solid var(--border)', background: 'transparent',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
          }}>
            <span style={{ display: 'block', width: 18, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}/>
            <span style={{ display: 'block', width: 18, height: 2, background: 'var(--text)', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }}/>
            <span style={{ display: 'block', width: 18, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}/>
          </button>
        </div>
      )}

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0,
          background: 'var(--card)', borderBottom: '1px solid var(--border)',
          padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 4,
          zIndex: 49, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}>
          {links.map(({ href, label, exact }) => {
            const active = exact ? p === href : (p === href || p?.startsWith(href));
            return (
              <Link key={href} href={href} style={{
                padding: '11px 16px', borderRadius: 10, fontSize: 15, fontWeight: 600,
                textDecoration: 'none',
                color: active ? 'var(--btn)' : 'var(--text)',
                background: active ? 'rgba(201,24,74,0.09)' : 'transparent',
              }}>{label}</Link>
            );
          })}
          <Link href="/pro" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '11px 16px', borderRadius: 10, fontSize: 15, fontWeight: 800,
            textDecoration: 'none', color: '#e8185a',
          }}>
            <StarIcon/> Pro
          </Link>
          <Link href="/signin" style={{
            marginTop: 4, padding: '12px 16px', borderRadius: 10, fontSize: 15, fontWeight: 700,
            textDecoration: 'none', color: '#fff', background: 'var(--btn)',
            textAlign: 'center', boxShadow: '0 2px 8px var(--btn-shadow)',
          }}>Sign in</Link>
        </div>
      )}
    </nav>
  );
}
