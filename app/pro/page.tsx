'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { CatMascot } from '@/components/CatMascot';

const SKINS = [
  { name: 'Cherry Blossom', desc: 'The default kawaii pink', gradient: 'linear-gradient(135deg,#ffb3c6,#ff4d6d)', tag: 'FREE' },
  { name: 'Midnight Sakura', desc: 'Dark mode with rose accents', gradient: 'linear-gradient(135deg,#2a0a1f,#c9184a)', tag: 'PRO' },
  { name: 'Ocean Mint',     desc: 'Cool teal and seafoam',     gradient: 'linear-gradient(135deg,#00b4d8,#90e0ef)', tag: 'PRO' },
  { name: 'Golden Hour',   desc: 'Warm sunset palette',       gradient: 'linear-gradient(135deg,#f77f00,#fcbf49)', tag: 'PRO' },
  { name: 'Lavender Mist', desc: 'Soft purple and violet',    gradient: 'linear-gradient(135deg,#7b2d8b,#c77dff)', tag: 'PRO' },
  { name: 'Matcha',        desc: 'Earthy greens and cream',   gradient: 'linear-gradient(135deg,#386641,#a7c957)', tag: 'PRO' },
];

const FEATURES = [
  'Custom board skins',
  'Priority AI Coach — deeper analysis',
  'Extended stats by difficulty',
  'Global leaderboard highlights',
  'Early access to new game modes',
  'No ads, ever',
];

export default function ProPage() {
  const [isDark, setIsDark]   = useState(false);
  const [billing, setBilling] = useState<'monthly'|'yearly'>('monthly');

  const toggle = () => {
    const n = !isDark;
    setIsDark(n);
    document.documentElement.classList.toggle('dark', n);
    localStorage.setItem('theme', n ? 'dark' : 'light');
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar isDark={isDark} onToggleTheme={toggle}/>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--btn)', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 14px', borderRadius: 20, marginBottom: 20 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1l1.2 2.4L9 3.8 7 5.7l.5 2.8L5 7.2 2.5 8.5 3 5.7 1 3.8l2.8-.4z" fill="currentColor"/>
            </svg>
            Mineko Pro
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, letterSpacing: -1, marginBottom: 14, lineHeight: 1.1 }}>
            Level up your game
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Custom skins, advanced AI, deeper stats, and exclusive game modes — everything a serious sweeper needs.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {(['monthly','yearly'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 13, transition: 'all 0.15s',
                background: billing === b ? 'var(--btn)' : 'transparent',
                color: billing === b ? '#fff' : 'var(--muted)',
                boxShadow: billing === b ? '0 2px 8px var(--btn-shadow)' : 'none',
              }}>
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
                {b === 'yearly' && <span style={{ marginLeft: 6, fontSize: 10, background: billing === 'yearly' ? 'rgba(255,255,255,0.25)' : 'var(--accent)', color: '#fff', padding: '1px 6px', borderRadius: 10, fontWeight: 800 }}>-35%</span>}
              </button>
            ))}
          </div>

          {/* Price card */}
          <div style={{
            background: 'var(--card)', border: '2px solid var(--btn)',
            borderRadius: 20, padding: '32px 40px', maxWidth: 360, margin: '0 auto',
            boxShadow: '0 8px 40px var(--btn-shadow)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--btn)', lineHeight: 1 }}>
                {billing === 'monthly' ? '$4.99' : '$3.25'}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: 14, paddingBottom: 8 }}>
                / month
              </span>
            </div>
            {billing === 'yearly' && (
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>billed as $39 / year</div>
            )}
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
              {billing === 'monthly' ? 'Cancel any time' : 'Save $20.88 vs monthly'}
            </div>
            <button onClick={() => alert('Payment coming soon!')} style={{
              width: '100%', background: 'var(--btn)', color: '#fff',
              border: 'none', borderRadius: 12, padding: '14px',
              fontSize: 16, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 16px var(--btn-shadow)',
            }}>
              Start free trial
            </button>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>7 days free, no credit card required</div>
          </div>
        </div>

        {/* Skin Vault */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <h2 style={{ fontWeight: 900, fontSize: 18, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>Skin Vault</h2>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
            {SKINS.map(skin => (
              <div key={skin.name} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 16, overflow: 'hidden',
                transition: 'transform 0.2s', cursor: 'default',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
                <div style={{ height: 120, background: skin.gradient }}/>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{skin.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{skin.desc}</div>
                  <div style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                    padding: '2px 8px', borderRadius: 10,
                    background: skin.tag === 'FREE' ? 'rgba(22,163,74,0.12)' : 'rgba(201,24,74,0.10)',
                    color: skin.tag === 'FREE' ? '#16a34a' : 'var(--btn)',
                    border: `1px solid ${skin.tag === 'FREE' ? 'rgba(22,163,74,0.3)' : 'rgba(201,24,74,0.25)'}`,
                  }}>{skin.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <h2 style={{ fontWeight: 900, fontSize: 18, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>Everything included</h2>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
            {FEATURES.map(f => (
              <div key={f} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 16px',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(201,24,74,0.1)', border: '1px solid rgba(201,24,74,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="var(--btn)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '40px 32px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <CatMascot mood="playing" size={80}/>
          <div style={{ fontWeight: 900, fontSize: 22 }}>Ready to go pro?</div>
          <p style={{ color: 'var(--muted)', maxWidth: 380, lineHeight: 1.6, fontSize: 14 }}>
            Join thousands of players who take their minesweeping seriously.
          </p>
          <button onClick={() => alert('Payment coming soon!')} style={{
            background: 'var(--btn)', color: '#fff',
            border: 'none', borderRadius: 12, padding: '13px 36px',
            fontSize: 15, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 4px 16px var(--btn-shadow)',
          }}>
            Get Mineko Pro
          </button>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>7-day free trial &bull; Cancel anytime</div>
        </div>

      </main>
    </div>
  );
}
