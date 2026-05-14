'use client';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { loadStats, formatTime } from '@/lib/storage';

type Tab = 'beginner'|'intermediate'|'expert'|'daily';
const MOCK: Record<Tab,{rank:number;name:string;time:number;city:string;flag:string}[]> = {
  beginner: [
    {rank:1,name:'SpeedDemon_KZ',time:3210,city:'Almaty',flag:'🇰🇿'},
    {rank:2,name:'ProMiner99',time:4520,city:'Astana',flag:'🇰🇿'},
    {rank:3,name:'QuickClick',time:5100,city:'Shymkent',flag:'🇰🇿'},
    {rank:4,name:'BombSquad',time:5890,city:'Almaty',flag:'🇰🇿'},
    {rank:5,name:'MineHunter',time:6230,city:'Karaganda',flag:'🇰🇿'},
    {rank:6,name:'LogicMaster',time:7100,city:'Almaty',flag:'🇰🇿'},
    {rank:7,name:'GridMaster',time:8200,city:'Atyrau',flag:'🇰🇿'},
    {rank:8,name:'CellReveal',time:9100,city:'Semey',flag:'🇰🇿'},
  ],
  intermediate: [
    {rank:1,name:'ExpertPlayer',time:25400,city:'Almaty',flag:'🇰🇿'},
    {rank:2,name:'IntermediatePro',time:31200,city:'Astana',flag:'🇰🇿'},
    {rank:3,name:'BoardClearer',time:38900,city:'Shymkent',flag:'🇰🇿'},
    {rank:4,name:'FlagMaster',time:42100,city:'Almaty',flag:'🇰🇿'},
    {rank:5,name:'MidLevelKing',time:49000,city:'Karaganda',flag:'🇰🇿'},
  ],
  expert: [
    {rank:1,name:'GrandMaster',time:45200,city:'Almaty',flag:'🇰🇿'},
    {rank:2,name:'MineGod',time:62300,city:'Astana',flag:'🇰🇿'},
    {rank:3,name:'SpeedSweeper',time:78100,city:'Almaty',flag:'🇰🇿'},
    {rank:4,name:'ProSweeper',time:95000,city:'Shymkent',flag:'🇰🇿'},
    {rank:5,name:'ExpertElite',time:112000,city:'Karaganda',flag:'🇰🇿'},
  ],
  daily: [
    {rank:1,name:'DailyChamp',time:32100,city:'Almaty',flag:'🇰🇿'},
    {rank:2,name:'StreakKing',time:38400,city:'Astana',flag:'🇰🇿'},
    {rank:3,name:'MorningMiner',time:44200,city:'Shymkent',flag:'🇰🇿'},
    {rank:4,name:'DailyGrinder',time:52000,city:'Almaty',flag:'🇰🇿'},
    {rank:5,name:'EverydayPlayer',time:61100,city:'Karaganda',flag:'🇰🇿'},
  ],
};
const MEDALS=['🥇','🥈','🥉'];

export default function LeaderboardPage() {
  const [isDark,setIsDark]=useState(false);
  const [tab,setTab]=useState<Tab>('beginner');
  const [localBest,setLocalBest]=useState<number|null>(null);
  useEffect(()=>{
    setIsDark(document.documentElement.classList.contains('dark'));
    const s=loadStats();
    setLocalBest(tab==='daily'?s.dailyBestTime:s[tab as 'beginner'|'intermediate'|'expert']?.bestTime??null);
  },[tab]);
  const toggle=()=>{const n=!isDark;setIsDark(n);document.documentElement.classList.toggle('dark',n);localStorage.setItem('theme',n?'dark':'light');};

  const bg=isDark?'#0a0514':'#faf5ff';
  const text=isDark?'#f5f3ff':'#1e1b4b';
  const muted=isDark?'#94a3b8':'#64748b';
  const card=isDark?'rgba(30,20,60,0.7)':'rgba(255,255,255,0.7)';
  const border=isDark?'rgba(139,92,246,0.25)':'rgba(196,181,253,0.5)';
  const tabs: {key:Tab;label:string}[] = [{key:'beginner',label:'🐣 Beginner'},{key:'intermediate',label:'🧐 Intermediate'},{key:'expert',label:'💀 Expert'},{key:'daily',label:'📅 Daily'}];

  return (
    <div style={{background:bg,minHeight:'100vh'}}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>
      <main style={{padding:'24px 16px',maxWidth:700,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <h1 style={{fontSize:30,fontWeight:900,background:'linear-gradient(135deg,#8b5cf6,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:4}}>🏆 Global Leaderboard</h1>
          <p style={{color:muted,fontSize:14}}>Top players worldwide • All times verified</p>
        </div>

        <div style={{display:'flex',gap:4,marginBottom:20,background:isDark?'rgba(0,0,0,0.3)':'rgba(255,255,255,0.5)',backdropFilter:'blur(10px)',borderRadius:14,padding:4,border:`1px solid ${border}`}}>
          {tabs.map(({key,label})=>(
            <button key={key} onClick={()=>setTab(key)} style={{
              flex:1,padding:'8px 6px',borderRadius:10,border:'none',
              fontWeight:700,fontSize:12,cursor:'pointer',transition:'all 0.15s',
              background:tab===key?'linear-gradient(135deg,#8b5cf6,#ec4899)':'transparent',
              color:tab===key?'#fff':muted,
              boxShadow:tab===key?'0 4px 12px rgba(139,92,246,0.4)':'none',
            }}>{label}</button>
          ))}
        </div>

        {localBest&&(
          <div style={{background:isDark?'rgba(109,40,217,0.15)':'rgba(196,181,253,0.2)',backdropFilter:'blur(10px)',border:`1px solid ${isDark?'rgba(139,92,246,0.35)':'rgba(196,181,253,0.7)'}`,borderRadius:14,padding:'12px 18px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontSize:11,background:'linear-gradient(135deg,#8b5cf6,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontWeight:800}}>YOUR PERSONAL BEST</div>
              <div style={{fontSize:22,fontWeight:900,background:'linear-gradient(135deg,#8b5cf6,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{formatTime(localBest)}</div>
            </div>
            <div style={{fontSize:32}}>🏅</div>
          </div>
        )}

        <div style={{background:card,backdropFilter:'blur(16px)',border:`1px solid ${border}`,borderRadius:20,overflow:'hidden'}}>
          <div style={{display:'grid',gridTemplateColumns:'52px 1fr 110px 110px',padding:'10px 18px',borderBottom:`1px solid ${border}`,background:isDark?'rgba(0,0,0,0.3)':'rgba(255,255,255,0.5)'}}>
            {['#','Player','Time','City'].map(h=>(<div key={h} style={{fontSize:11,fontWeight:700,color:muted,textTransform:'uppercase',letterSpacing:0.5}}>{h}</div>))}
          </div>
          {MOCK[tab].map((e,i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'52px 1fr 110px 110px',padding:'14px 18px',borderBottom:i<MOCK[tab].length-1?`1px solid ${border}`:'none',alignItems:'center',transition:'background 0.1s',cursor:'default'}}
              onMouseEnter={el=>el.currentTarget.style.background=isDark?'rgba(139,92,246,0.08)':'rgba(196,181,253,0.15)'}
              onMouseLeave={el=>el.currentTarget.style.background='transparent'}>
              <div style={{fontWeight:900,fontSize:i<3?22:15,color:i<3?'transparent':muted,background:i<3?'linear-gradient(135deg,#8b5cf6,#ec4899)':undefined,WebkitBackgroundClip:i<3?'text':undefined,WebkitTextFillColor:i<3?'transparent':undefined}}>{MEDALS[i]??e.rank}</div>
              <div style={{fontWeight:600,color:text,fontSize:14}}>{e.name}</div>
              <div style={{fontWeight:800,fontSize:14,background:'linear-gradient(135deg,#8b5cf6,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{formatTime(e.time)}</div>
              <div style={{fontSize:13,color:muted}}>{e.flag} {e.city}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:14,fontSize:12,color:muted}}>
          Connect Supabase to see real global scores • Your local best shown above
        </div>
      </main>
    </div>
  );
}
