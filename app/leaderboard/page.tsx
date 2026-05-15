'use client';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { loadStats, formatTime } from '@/lib/storage';

type Tab = 'beginner'|'intermediate'|'expert'|'daily';
const MOCK: Record<Tab, {rank:number;name:string;time:number;city:string;noHints?:boolean}[]> = {
  beginner: [
    {rank:1,name:'SpeedDemon_KZ',time:3210, city:'Almaty',   noHints:true},
    {rank:2,name:'ProMiner99',   time:4520, city:'Astana'},
    {rank:3,name:'QuickClick',   time:5100, city:'Shymkent', noHints:true},
    {rank:4,name:'BombSquad',    time:5890, city:'Almaty'},
    {rank:5,name:'MineHunter',   time:6230, city:'Karaganda',noHints:true},
    {rank:6,name:'LogicMaster',  time:7100, city:'Almaty'},
    {rank:7,name:'GridMaster',   time:8200, city:'Atyrau'},
    {rank:8,name:'CellReveal',   time:9100, city:'Semey'},
  ],
  intermediate: [
    {rank:1,name:'ExpertPlayer',    time:25400,city:'Almaty',   noHints:true},
    {rank:2,name:'IntermediatePro', time:31200,city:'Astana'},
    {rank:3,name:'BoardClearer',    time:38900,city:'Shymkent'},
    {rank:4,name:'FlagMaster',      time:42100,city:'Almaty',   noHints:true},
    {rank:5,name:'MidLevelKing',    time:49000,city:'Karaganda'},
  ],
  expert: [
    {rank:1,name:'GrandMaster',  time:45200, city:'Almaty',   noHints:true},
    {rank:2,name:'MineGod',      time:62300, city:'Astana'},
    {rank:3,name:'SpeedSweeper', time:78100, city:'Almaty',   noHints:true},
    {rank:4,name:'ProSweeper',   time:95000, city:'Shymkent'},
    {rank:5,name:'ExpertElite',  time:112000,city:'Karaganda'},
  ],
  daily: [
    {rank:1,name:'DailyChamp',     time:32100,city:'Almaty',   noHints:true},
    {rank:2,name:'StreakKing',      time:38400,city:'Astana'},
    {rank:3,name:'MorningMiner',   time:44200,city:'Shymkent', noHints:true},
    {rank:4,name:'DailyGrinder',   time:52000,city:'Almaty'},
    {rank:5,name:'EverydayPlayer', time:61100,city:'Karaganda'},
  ],
};

function NoHintsBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)',
      borderRadius: 20, padding: '2px 7px',
      fontSize: 10, fontWeight: 700, color: 'var(--btn)',
      whiteSpace: 'nowrap', letterSpacing: 0.2,
    }}>
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M1.5 4.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      No hints
    </span>
  );
}

function MedalIcon({ rank }: { rank: number }) {
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  if (rank > 3) return <span style={{ fontWeight: 900, fontSize: 14, color: 'var(--muted)' }}>{rank}</span>;
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" fill={colors[rank-1]}/>
      <text x="11" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">{rank}</text>
    </svg>
  );
}

function TrophyBig() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M10 6h20v14a10 10 0 01-20 0V6z" fill="#ffc2d1"/>
      <path d="M4 7h6v10a3 3 0 01-6 0V7z" fill="#ffd6e7"/>
      <path d="M30 7h6v10a3 3 0 01-6 0V7z" fill="#ffd6e7"/>
      <rect x="15" y="26" width="10" height="5" fill="#ff85a1"/>
      <rect x="10" y="31" width="20" height="5" rx="2.5" fill="#c9184a"/>
    </svg>
  );
}

export default function LeaderboardPage() {
  const [isDark, setIsDark]     = useState(false);
  const [tab, setTab]           = useState<Tab>('beginner');
  const [localBest, setLocalBest]       = useState<number|null>(null);
  const [localNoHints, setLocalNoHints] = useState<boolean|null>(null);

  useEffect(() => {
    const s = localStorage.getItem('theme');
    const dark = s === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);
  useEffect(() => {
    const s = loadStats();
    if (tab === 'daily') {
      setLocalBest(s.dailyBestTime);
      setLocalNoHints(s.dailyLastUsedHints === false ? true : false);
    } else {
      setLocalBest(s[tab as 'beginner'|'intermediate'|'expert']?.bestTime ?? null);
      setLocalNoHints(null);
    }
  }, [tab]);
  const toggle = () => { const n=!isDark; setIsDark(n); document.documentElement.classList.toggle('dark',n); localStorage.setItem('theme',n?'dark':'light'); };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'beginner',     label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'expert',       label: 'Expert' },
    { key: 'daily',        label: 'Daily' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>
      <main style={{ padding: '24px 16px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><TrophyBig/></div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Leaderboard</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Top times worldwide</p>
        </div>

        <div style={{
          display: 'flex', gap: 4, marginBottom: 16,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 4,
        }}>
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none',
              fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
              background: tab === key ? 'var(--btn)' : 'transparent',
              color: tab === key ? '#fff' : 'var(--muted)',
              boxShadow: tab === key ? '0 3px 10px rgba(201,24,74,0.3)' : 'none',
            }}>{label}</button>
          ))}
        </div>

        {localBest && (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 14,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--btn)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Your best</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--btn)' }}>{formatTime(localBest)}</span>
                {localNoHints && <NoHintsBadge/>}
              </div>
            </div>
            <MedalIcon rank={1}/>
          </div>
        )}

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '48px 1fr 90px 110px',
            padding: '9px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          }}>
            {['#','Player','Time','City'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</div>
            ))}
          </div>
          {MOCK[tab].map((e, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '48px 1fr 90px 110px',
              padding: '13px 16px',
              borderBottom: i < MOCK[tab].length-1 ? '1px solid var(--border)' : 'none',
              alignItems: 'center', transition: 'background 0.1s', cursor: 'default',
            }}
              onMouseEnter={el => el.currentTarget.style.background = 'rgba(255,77,109,0.04)'}
              onMouseLeave={el => el.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center' }}><MedalIcon rank={e.rank}/></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{e.name}</span>
                {e.noHints && <NoHintsBadge/>}
              </div>
              <div style={{ fontWeight: 800, color: 'var(--btn)', fontSize: 14 }}>{formatTime(e.time)}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{e.city}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
