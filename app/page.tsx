'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { loadStats, formatTime } from '@/lib/storage';

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [stats, setStats]   = useState(() => loadStats());
  useEffect(() => { setIsDark(document.documentElement.classList.contains('dark')); setStats(loadStats()); }, []);
  const toggle = () => { const n=!isDark; setIsDark(n); document.documentElement.classList.toggle('dark',n); localStorage.setItem('theme',n?'dark':'light'); };

  const bg    = isDark ? '#111'    : '#fefcf8';
  const bg2   = isDark ? '#1a1a1a' : '#f5f0e8';
  const text  = isDark ? '#f0f0f0' : '#1a1a1a';
  const muted = isDark ? '#777'    : '#888';
  const bdr   = isDark ? '#222'    : '#e8ddd0';

  const totalGames = (['beginner','intermediate','expert'] as const).reduce((s,d)=>s+stats[d].gamesPlayed,0);
  const totalWins  = (['beginner','intermediate','expert'] as const).reduce((s,d)=>s+stats[d].wins,0);

  const features = [
    { icon:'🤖', title:'AI Coach',        desc:'Real-time probability overlay. Every hidden cell shows its mine risk so you never guess blindly.',       bg: isDark?'#0d2818':'#dcfce7', accent:'#16a34a' },
    { icon:'📅', title:'Daily Challenge',  desc:'Same board for everyone worldwide, every day. Build streaks and race the clock.',                         bg: isDark?'#2a1500':'#fff7ed', accent:'#ea580c' },
    { icon:'🏆', title:'Leaderboard',      desc:'Compare your best times globally. See who’s fastest in your city.',                                      bg: isDark?'#1a0a2e':'#f3e8ff', accent:'#9333ea' },
    { icon:'📊', title:'Deep Stats',        desc:'Win rate, streaks, best times — all tracked locally. No sign-up, no email, just data.',                    bg: isDark?'#001a2e':'#eff6ff', accent:'#2563eb' },
    { icon:'⚡',   title:'Always Fair',      desc:'Mines are placed after your first click. First move is always safe, guaranteed.',                          bg: isDark?'#1a1a00':'#fefce8', accent:'#ca8a04' },
    { icon:'🖥️', title:'Works Everywhere', desc:'Mobile-friendly with long-press to flag. Plays great on phone, tablet, and desktop.',                     bg: isDark?'#200a0a':'#fff1f2', accent:'#e8533a' },
  ];

  return (
    <div style={{ background:bg, minHeight:'100vh' }}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>

      {/* Hero */}
      <section style={{ padding:'72px 24px 56px', textAlign:'center', borderBottom:`1px solid ${bdr}` }}>
        <div className="anim-float" style={{ fontSize:64, marginBottom:20, display:'inline-block' }}>💣</div>
        <h1 style={{ fontSize:'clamp(2.2rem,6vw,3.6rem)', fontWeight:900, color:text, letterSpacing:-1.5, marginBottom:14, lineHeight:1.1 }}>
          Minesweeper,<br/><span style={{ color:'#e8533a' }}>but smarter.</span>
        </h1>
        <p style={{ fontSize:'clamp(1rem,2.5vw,1.15rem)', color:muted, maxWidth:500, margin:'0 auto 32px', lineHeight:1.7 }}>
          An AI coach tells you exactly how risky each cell is.
          Daily challenges keep you coming back. Real stats track your growth.
        </p>
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/game" style={{
            background:'#e8533a', color:'#fff', padding:'13px 32px',
            borderRadius:10, fontWeight:800, fontSize:16, textDecoration:'none',
            boxShadow:'0 4px 16px rgba(232,83,58,0.35)', transition:'transform 0.15s',
          }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='translateY(0)'}>
            Play Now →
          </Link>
          <Link href="/daily" style={{
            background: isDark?'#1a1a1a':'#fff', color:text,
            padding:'13px 24px', borderRadius:10, fontWeight:700, fontSize:16,
            textDecoration:'none', border:`1px solid ${bdr}`,
          }}>📅 Today’s Puzzle</Link>
        </div>

        {totalGames>0&&(
          <div style={{ display:'flex', gap:40, justifyContent:'center', marginTop:48, flexWrap:'wrap' }}>
            {[
              { label:'Games Played', value:totalGames },
              { label:'Total Wins',   value:totalWins },
              { label:'Win Rate',     value:`${totalGames?Math.round(totalWins/totalGames*100):0}%` },
            ].map(({label,value})=>(
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:30, fontWeight:900, color:'#e8533a' }}>{value}</div>
                <div style={{ fontSize:12, color:muted, fontWeight:600, marginTop:2, textTransform:'uppercase', letterSpacing:0.5 }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section style={{ padding:'56px 24px', maxWidth:1080, margin:'0 auto' }}>
        <h2 style={{ textAlign:'center', fontSize:26, fontWeight:800, color:text, marginBottom:6 }}>Everything you need to get good</h2>
        <p style={{ textAlign:'center', color:muted, marginBottom:36, fontSize:14 }}>Not just another Minesweeper clone.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
          {features.map(({icon,title,desc,bg:fbg,accent})=>(
            <div key={title} style={{
              background:fbg, borderRadius:16, padding:'22px',
              border:`1px solid ${isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)'}`,
              transition:'transform 0.2s',
            }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-3px)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='translateY(0)'}>
              <div style={{ fontSize:34, marginBottom:10 }}>{icon}</div>
              <h3 style={{ fontWeight:800, color: isDark?'#f0f0f0':accent, marginBottom:6, fontSize:16 }}>{title}</h3>
              <p style={{ color: isDark?'#aaa':'#555', lineHeight:1.65, fontSize:13 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best times */}
      {(['beginner','intermediate','expert'] as const).some(d=>stats[d].bestTime)&&(
        <section style={{ padding:'0 24px 56px', maxWidth:560, margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontSize:20, fontWeight:800, color:text, marginBottom:16 }}>🏅 Your Best Times</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {(['beginner','intermediate','expert'] as const).map(d=>(
              <div key={d} style={{ background:isDark?'#1a1a1a':'#fff', border:`1px solid ${bdr}`, borderRadius:12, padding:'14px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:muted, textTransform:'uppercase', fontWeight:700, letterSpacing:0.5 }}>{d}</div>
                <div style={{ fontSize:20, fontWeight:900, color:'#e8533a', marginTop:4 }}>
                  {stats[d].bestTime ? formatTime(stats[d].bestTime!) : '—'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pro */}
      <section style={{ background:bg2, borderTop:`1px solid ${bdr}`, padding:'44px 24px', textAlign:'center' }}>
        <p style={{ fontSize:12, color:muted, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Coming soon</p>
        <h2 style={{ fontSize:22, fontWeight:900, color:text, marginBottom:8 }}>MinesweeperPro ✨</h2>
        <p style={{ color:muted, maxWidth:420, margin:'0 auto 20px', lineHeight:1.65, fontSize:14 }}>
          Custom board themes, advanced AI analysis, leaderboard highlights, and no ads.
        </p>
        <button onClick={()=>alert('🚀 Coming soon! Stay tuned.')} style={{
          background:'#1a1a1a', color:'#fff', padding:'11px 28px',
          borderRadius:10, fontWeight:700, fontSize:14,
          border:'none', cursor:'pointer', transition:'background 0.15s',
        }}
          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#333'}
          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#1a1a1a'}>
          Join the waitlist
        </button>
      </section>

      <footer style={{ textAlign:'center', padding:'20px', color:muted, fontSize:13, borderTop:`1px solid ${bdr}` }}>
        MinesweeperPro © 2025 — made with ❤️
      </footer>
    </div>
  );
}
