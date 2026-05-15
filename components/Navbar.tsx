'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const p = usePathname();
  const links = [
    { href: '/game',        label: 'Play' },
    { href: '/daily',       label: 'Daily' },
    { href: '/leaderboard', label: 'Scores' },
  ];
  const bg     = isDark ? '#111' : '#fff';
  const border = isDark ? '#222' : '#ede8e0';
  const text   = isDark ? '#f0f0f0' : '#1a1a1a';
  const muted  = isDark ? '#777' : '#888';
  const accent = '#e8533a';
  return (
    <nav style={{ background: bg, borderBottom: `1px solid ${border}`, padding: '0 24px', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50 }}>
      <Link href="/" style={{ fontWeight: 800, fontSize: 18, color: text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 20 }}>💣</span> MinesweeperPro
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {links.map(({ href, label }) => {
          const active = p === href;
          return (
            <Link key={href} href={href} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s',
              color: active ? accent : muted,
              background: active ? (isDark ? 'rgba(232,83,58,0.12)' : 'rgba(232,83,58,0.08)') : 'transparent',
            }}>{label}</Link>
          );
        })}
        <button onClick={onToggleTheme} style={{
          marginLeft: 8, width: 34, height: 34, borderRadius: 8,
          border: `1px solid ${border}`, background: 'transparent',
          cursor: 'pointer', fontSize: 15, transition: 'background 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{isDark ? '☀️' : '🌙'}</button>
      </div>
    </nav>
  );
}
