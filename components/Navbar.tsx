'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Home', emoji: '🏠' },
    { href: '/game', label: 'Play', emoji: '💣' },
    { href: '/daily', label: 'Daily', emoji: '📅' },
    { href: '/leaderboard', label: 'Scores', emoji: '🏆' },
  ];
  return (
    <nav style={{
      background: isDark ? 'rgba(10,5,25,0.85)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(196,181,253,0.5)'}`,
      padding: '0 20px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 60,
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Link href="/" style={{
        fontWeight: 900, fontSize: 20, textDecoration: 'none',
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>💣 MinesweeperPro</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {links.map(({ href, label, emoji }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5,
              background: active ? (isDark ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.12)') : 'transparent',
              color: active ? '#8b5cf6' : (isDark ? '#94a3b8' : '#6b7280'),
            }}>
              <span>{emoji}</span><span>{label}</span>
            </Link>
          );
        })}
        <button onClick={onToggleTheme} title="Toggle theme" style={{
          marginLeft: 8, width: 38, height: 38, borderRadius: '50%', border: 'none',
          background: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)',
          cursor: 'pointer', fontSize: 18, transition: 'transform 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15) rotate(20deg)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1) rotate(0)')}>
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
