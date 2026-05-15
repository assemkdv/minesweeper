'use client';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { loadStats, formatTime } from '@/lib/storage';

type Tab='beginner'|'intermediate'|'expert'|'daily';
const MOCK: Record<Tab,{rank:number;name:string;time:number;city:string}[]> = {
  beginner:[
    {rank:1,name:'SpeedDemon_KZ',time:3210,city:'Almaty 🇰🇿'},
    {rank:2,name:'ProMiner99',   time:4520,city:'Astana 🇰🇿'},
    {rank:3,name:'QuickClick',   time:5100,city:'Shymkent 🇰🇿'},
    {rank:4,name:'BombSquad',    time:5890,city:'Almaty 🇰🇿'},
    {rank:5,name:'MineHunter',   time:6230,city:'Karaganda 🇰🇿'},
    {rank:6,name:'LogicMaster',  time:7100,city:'Almaty 🇰🇿'},
    {rank:7,name:'GridMaster',   time:8200,city:'Atyrau 🇰🇿'},
    {rank:8,name:'CellReveal',   time:9100,city:'Semey 🇰🇿'},
  ],
  intermediate:[
    {rank:1,name:'ExpertPlayer',    time:25400,city:'Almaty 🇰🇿'},
    {rank:2,name:'IntermediatePro', time:31200,city:'Astana 🇰🇿'},
    {rank:3,name:'BoardClearer',    time:38900,city:'Shymkent 🇰🇿'},
    {rank:4,name:'FlagMaster',      time:42100,city:'Almaty 🇰🇿'},
    {rank:5,name:'MidLevelKing',    time:49000,city:'Karaganda 🇰🇿'},
  ],
  expert:[
    {rank:1,name:'GrandMaster',  time:45200, city:'Almaty 🇰🇿'},
    {rank:2,name:'MineGod',      time:62300, city:'Astana 🇰🇿'},
    {rank:3,name:'SpeedSweeper', time:78100, city:'Almaty 🇰🇿'},
    {rank:4,name:'ProSweeper',   time:95000, city:'Shymkent 🇰🇿'},
    {rank:5,name:'ExpertElite',  time:112000,city:'Karaganda 🇰🇿'},
  ],
  daily:[
    {rank:1,name:'DailyChamp',     time:32100,city:'Almaty 🇰🇿'},
    {rank:2,name:'StreakKing',      time:38400,city:'Astana 🇰🇿'},
    {rank:3,name:'MorningMiner',   time:44200,city:'Shymkent 🇰🇿'},
    {rank:4,name:'DailyGrinder',   time:52000,city:'Almaty 🇰🇿'},
    {rank:5,name:'EverydayPlayer', time:61100,city:'Karaganda 🇰🇿'},
  ],
};
const MEDALS=['🥇','🥈','🥉'];

export default function LeaderboardPage() {
  const [isDark,setIsDark]=useState(false);
  const [tab,setTab]=useState<Tab>('beginner');
  const [localBest,setLocalBest]=useState<number|null>(null);
  useEffect(()=>{ setIsDark(document.documentElement.classList.contains('dark')); },[]);
  useEffect(()=>{
    const s=loadStats();
    setLocalBest(tab==='daily'?s.dailyBestTime:s[tab as 'beginner'|'intermediate'|'expert']?.bestTime??null);
  },[tab]);
  const toggle=()=>{const n=!isDark;setIsDark(n);document.documentElement.classList.toggle('dark',n);localStorage.setItem('theme',n?'dark':'light');};

  const bg  = isDark?'#111':'#fefcf8';
  const text = isDark?'#f0f0f0':'#1a1a1a';
  const muted = isDark?'#777':'#888';
  const card = isDark?'#1a1a1a':'#fff';
  const bdr  = isDark?'#222':'#e8ddd0';
  const tabs: {key:Tab;label:string}[] = [
    {key:'beginner',    label:'🐣 Beginner'},
    {key:'intermediate',label:'🧐 Intermediate'},
    {key:'expert',      label:'💀 Expert'},
    {key:'daily',       label:'📅 Daily'},
  ];

  return (
    <div style={{background:bg,minHeight:'100vh'}}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>
      <main style={{padding:'24px 16px',maxWidth:680,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <h1 style={{fontSize:28,fontWeight:900,color:text,marginBottom:4}}>🏆 Leaderboard</h1>
          <p style={{color:muted,fontSize:14}}>Top times worldwide</p>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,marginBottom:16,background:isDark?'#1a1a1a':'#f5f0e8',border:`1px solid ${bdr}`,borderRadius:12,padding:4}}>
          {tabs.map(({key,label})=>(
            <button key={key} onClick={()=>setTab(key)} style={{
              flex:1,padding:'8px 4px',borderRadius:8,border:'none',
              fontWeight:700,fontSize:12,cursor:'pointer',transition:'all 0.15s',
              background: tab===key?'#e8533a':'transparent',
              color:       tab===key?'#fff':muted,
              boxShadow:   tab===key?'0 3px 10px rgba(232,83,58,0.35)':'none',
            }}>{label}</button>
          ))}
        </div>

        {/* Personal best */}
        {localBest&&(
          <div style={{background:isDark?'#1a1a1a':'#fff7ed',border:`1px solid ${isDark?'#333':'#fed7aa'}`,borderRadius:12,padding:'12px 16px',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontSize:11,color:'#ea580c',fontWeight:800,textTransform:'uppercase',letterSpacing:0.5}}>Your best</div>
              <div style={{fontSize:22,fontWeight:900,color:'#e8533a'}}>{formatTime(localBest)}</div>
            </div>
            <span style={{fontSize:28}}>🏅</span>
          </div>
        )}

        {/* Table */}
        <div style={{background:card,border:`1px solid ${bdr}`,borderRadius:16,overflow:'hidden'}}>
          <div style={{display:'grid',gridTemplateColumns:'48px 1fr 100px 130px',padding:'9px 16px',background:isDark?'#111':'#faf6f1',borderBottom:`1px solid ${bdr}`}}>
            {['#','Player','Time','City'].map(h=>(<div key={h} style={{fontSize:11,fontWeight:700,color:muted,textTransform:'uppercase',letterSpacing:0.5}}>{h}</div>))}
          </div>
          {MOCK[tab].map((e,i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'48px 1fr 100px 130px',padding:'13px 16px',borderBottom:i<MOCK[tab].length-1?`1px solid ${bdr}`:'none',alignItems:'center',transition:'background 0.1s',cursor:'default'}}
              onMouseEnter={el=>el.currentTarget.style.background=isDark?'rgba(255,255,255,0.03)':'rgba(232,83,58,0.04)'}
              onMouseLeave={el=>el.currentTarget.style.background='transparent'}>
              <div style={{fontWeight:900,fontSize:i<3?20:14,lineHeight:1}}>{MEDALS[i]??e.rank}</div>
              <div style={{fontWeight:600,color:text,fontSize:14}}>{e.name}</div>
              <div style={{fontWeight:800,color:'#e8533a',fontSize:14}}>{formatTime(e.time)}</div>
              <div style={{fontSize:13,color:muted}}>{e.city}</div>
            </div>
          ))}
        </div>
        <p style={{textAlign:'center',marginTop:12,fontSize:12,color:muted}}>Connect Supabase to show real scores</p>
      </main>
    </div>
  );
}
