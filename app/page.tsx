'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { loadStats, formatTime } from '@/lib/storage';

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [stats, setStats] = useState(() => loadStats());
  useEffect(() => { setIsDark(document.documentElement.classList.contains('dark')); setStats(loadStats()); }, []);
  const toggle = () => { const n=!isDark; setIsDark(n); document.documentElement.classList.toggle('dark',n); localStorage.setItem('theme',n?'dark':'light'); };

  const bg = isDark ? '#0a0514' : '#faf5ff';
  const text = isDark ? '#f5f3ff' : '#1e1b4b';
  const muted = isDark ? '#a78bfa' : '#6b21a8';
  const card = isDark ? 'rgba(30,20,60,0.7)' : 'rgba(255,255,255,0.7)';
  const border = isDark ? 'rgba(139,92,246,0.25)' : 'rgba(196,181,253,0.5)';

  const totalGames = (['beginner','intermediate','expert'] as const).reduce((s,d)=>s+stats[d].gamesPlayed,0);
  const totalWins  = (['beginner','intermediate','expert'] as const).reduce((s,d)=>s+stats[d].wins,0);

  const features = [
    { icon:'🤖', title:'AI Coach', desc:'Real-time probability overlay shows exact mine risk for every hidden cell. Never guess blindly again.' },
    { icon:'📅', title:'Daily Challenge', desc:'Same seeded board for every player worldwide. Build streaks and compete on time.' },
    { icon:'🏆', title:'Leaderboard', desc:'Global rankings across Beginner, Intermediate, and Expert with city-level breakdown.' },
    { icon:'📊', title:'Deep Stats', desc:'Win rate, streaks, best times, average time — all tracked locally, no account needed.' },
    { icon:'⚡', title:'Fair Start', desc:'Mines are placed after your first click. The first move is always safe, guaranteed.' },
    { icon:'🎨', title:'Dark & Light', desc:'Silky smooth theme toggle with a cohesive purple palette in both modes.' },
  ];

  return (
    <div style={{ background:bg, minHeight:'100vh' }}>
      <Navbar isDark={isDark} onToggleTheme={toggle} />

      {/* Hero */}
      <section style={{
        background: isDark
          ? 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.3) 0%, transparent 70%), #0a0514'
          : 'radial-gradient(ellipse at 50% 0%, rgba(196,181,253,0.6) 0%, transparent 70%), #faf5ff',
        padding:'80px 24px 64px', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        {/* Floating decorative emojis */}
        {['💣','🚩','✨','💥','🌟'].map((e,i)=>(
          <span key={i} className="animate-float" style={{
            position:'absolute', fontSize:24+i*8, opacity:0.15,
            top:`${10+i*15}%`, left:`${5+i*20}%`,
            animationDelay:`${i*0.6}s`, animationDuration:`${3+i*0.5}s`,
            pointerEvents:'none',
          }}>{e}</span>
        ))}

        <div className="animate-float" style={{ fontSize:72, marginBottom:16 }}>💣</div>
        <h1 style={{ fontSize:'clamp(2rem,6vw,3.8rem)', fontWeight:900, color:text, marginBottom:12, letterSpacing:-1, lineHeight:1.1 }}>
          Minesweeper<span style={{ background:'linear-gradient(135deg,#8b5cf6,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Pro</span>
        </h1>
        <p style={{ fontSize:'clamp(1rem,2.5vw,1.2rem)', color:muted, maxWidth:520, margin:'0 auto 32px', lineHeight:1.7 }}>
          Train your probabilistic thinking with AI-powered hints,<br/>daily challenges, and global competition.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/game" style={{
            background:'linear-gradient(135deg,#8b5cf6,#ec4899)', color:'#fff',
            padding:'14px 36px', borderRadius:14, fontWeight:800, fontSize:16,
            textDecoration:'none', boxShadow:'0 6px 20px rgba(139,92,246,0.5)',
            transition:'transform 0.15s',
          }}>Play Now →</Link>
          <Link href="/daily" style={{
            background:card, backdropFilter:'blur(10px)',
            color:text, padding:'14px 28px', borderRadius:14,
            fontWeight:700, fontSize:16, textDecoration:'none',
            border:`1px solid ${border}`,
          }}>📅 Daily Challenge</Link>
        </div>

        {totalGames>0&&(
          <div style={{ display:'flex', gap:32, justifyContent:'center', marginTop:44, flexWrap:'wrap' }}>
            {[
              { label:'Games Played', value:totalGames },
              { label:'Total Wins',   value:totalWins },
              { label:'Win Rate',     value:`${totalGames?Math.round(totalWins/totalGames*100):0}%` },
            ].map(({label,value})=>(
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:32, fontWeight:900, background:'linear-gradient(135deg,#8b5cf6,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{value}</div>
                <div style={{ fontSize:12, color:muted, fontWeight:600, marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section style={{ padding:'60px 24px', maxWidth:1100, margin:'0 auto' }}>
        <h2 style={{ textAlign:'center', fontSize:28, fontWeight:800, color:text, marginBottom:6 }}>More than just a game</h2>
        <p style={{ textAlign:'center', color:muted, marginBottom:40, fontSize:15 }}>A platform built to make you genuinely better at probabilistic thinking</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:20 }}>
          {features.map(({icon,title,desc})=>(
            <div key={title} style={{
              background:card, backdropFilter:'blur(16px)',
              border:`1px solid ${border}`, borderRadius:20, padding:'24px',
              transition:'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(139,92,246,0.2)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
              <div style={{ fontSize:40, marginBottom:12 }}>{icon}</div>
              <h3 style={{ fontWeight:800, color:text, marginBottom:8, fontSize:18 }}>{title}</h3>
              <p style={{ color:muted, lineHeight:1.65, fontSize:14 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Personal bests */}
      {(['beginner','intermediate','expert'] as const).some(d=>stats[d].bestTime)&&(
        <section style={{ padding:'0 24px 60px', maxWidth:580, margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontSize:22, fontWeight:800, color:text, marginBottom:20 }}>🏅 Your Personal Bests</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {(['beginner','intermediate','expert'] as const).map(d=>(
              <div key={d} style={{ background:card, backdropFilter:'blur(16px)', border:`1px solid ${border}`, borderRadius:16, padding:'16px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:muted, textTransform:'uppercase', fontWeight:700, letterSpacing:0.5 }}>{d}</div>
                <div style={{ fontSize:22, fontWeight:900, background:'linear-gradient(135deg,#8b5cf6,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginTop:4 }}>
                  {stats[d].bestTime ? formatTime(stats[d].bestTime!) : '—'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pro CTA */}
      <section style={{ padding:'48px 24px', background: isDark?'rgba(139,92,246,0.08)':'rgba(196,181,253,0.15)', textAlign:'center', borderTop:`1px solid ${border}` }}>
        <div style={{ fontSize:36, marginBottom:10 }}>✨</div>
        <h2 style={{ fontSize:24, fontWeight:900, color:text, marginBottom:8 }}>Go Pro</h2>
        <p style={{ color:muted, maxWidth:460, margin:'0 auto 20px', lineHeight:1.65 }}>Custom themes, advanced AI analysis, priority leaderboard, and more.</p>
        <button onClick={()=>alert('🚀 Pro features coming soon! Stay tuned.')} style={{
          background:'linear-gradient(135deg,#8b5cf6,#ec4899)', color:'#fff',
          padding:'13px 32px', borderRadius:12, fontWeight:800, fontSize:15,
          border:'none', cursor:'pointer', boxShadow:'0 6px 20px rgba(139,92,246,0.4)',
          transition:'transform 0.15s',
        }}
          onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
          Upgrade to Pro →
        </button>
      </section>

      <footer style={{ textAlign:'center', padding:'24px', color:muted, fontSize:13, borderTop:`1px solid ${border}` }}>
        MinesweeperPro © 2025 — Built with ❤️ for probabilistic thinkers
      </footer>
    </div>
  );
}
