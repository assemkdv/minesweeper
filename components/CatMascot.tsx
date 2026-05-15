'use client';
import { useState, useEffect } from 'react';

export type CatMood = 'idle' | 'playing' | 'won' | 'lost';

export function CatMascot({ mood = 'idle', size = 64, onClick }: {
  mood?: CatMood;
  size?: number;
  onClick?: () => void;
}) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (mood !== 'idle' && mood !== 'playing') return;
    const schedule = () => {
      const delay = 2500 + Math.random() * 3000;
      return setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); schedule(); }, 150);
      }, delay);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, [mood]);

  const s = size;
  const isIdle    = mood === 'idle';
  const isPlaying = mood === 'playing';
  const isWon     = mood === 'won';
  const isLost    = mood === 'lost';

  return (
    <svg
      width={s} height={s} viewBox="0 0 64 64" fill="none"
      style={{ cursor: onClick ? 'pointer' : 'default', display: 'block' }}
      onClick={onClick}
    >
      {/* Body */}
      <ellipse cx="32" cy="38" rx="18" ry="16" fill="#ffb3c6"/>

      {/* Ears */}
      <polygon points="14,18 10,4 22,14" fill="#ffb3c6"/>
      <polygon points="50,18 54,4 42,14" fill="#ffb3c6"/>
      <polygon points="15,17 12,7 21,14" fill="#ff85a1"/>
      <polygon points="49,17 52,7 43,14" fill="#ff85a1"/>

      {/* Head */}
      <circle cx="32" cy="26" r="18" fill="#ffd6e7"/>

      {/* Detective hat (playing mode) */}
      {isPlaying && (
        <>
          <rect x="16" y="16" width="32" height="5" rx="2" fill="#3d1520"/>
          <rect x="20" y="4" width="24" height="13" rx="4" fill="#3d1520"/>
          <rect x="22" y="6" width="8" height="3" rx="1.5" fill="#ff4d6d" opacity="0.6"/>
        </>
      )}

      {/* Halo (won mode) */}
      {isWon && (
        <ellipse cx="32" cy="9" rx="10" ry="3" stroke="#FFD700" strokeWidth="2.5" fill="none"/>
      )}

      {/* Eyes */}
      {(isIdle || isPlaying) && !blink && (
        <>
          <circle cx="24" cy="25" r="4" fill="white"/>
          <circle cx="40" cy="25" r="4" fill="white"/>
          <circle cx="25" cy="25" r="2.2" fill="#3d1520"/>
          <circle cx="41" cy="25" r="2.2" fill="#3d1520"/>
          <circle cx="26" cy="24" r="0.8" fill="white"/>
          <circle cx="42" cy="24" r="0.8" fill="white"/>
        </>
      )}
      {/* Blink */}
      {(isIdle || isPlaying) && blink && (
        <>
          <path d="M20 25 Q24 22 28 25" stroke="#3d1520" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M36 25 Q40 22 44 25" stroke="#3d1520" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </>
      )}
      {/* Won eyes — crescent ^^ */}
      {isWon && (
        <>
          <path d="M20 26 Q24 21 28 26" stroke="#3d1520" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M36 26 Q40 21 44 26" stroke="#3d1520" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </>
      )}
      {/* Lost eyes — X X */}
      {isLost && (
        <>
          <line x1="21" y1="22" x2="27" y2="28" stroke="#3d1520" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="27" y1="22" x2="21" y2="28" stroke="#3d1520" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="37" y1="22" x2="43" y2="28" stroke="#3d1520" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="43" y1="22" x2="37" y2="28" stroke="#3d1520" strokeWidth="2.5" strokeLinecap="round"/>
        </>
      )}

      {/* Nose */}
      <ellipse cx="32" cy="30" rx="2" ry="1.5" fill="#ff85a1"/>

      {/* Mouth */}
      {!isLost && (
        <path d="M29 32.5 Q32 35 35 32.5" stroke="#ff85a1" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      )}
      {isLost && (
        <path d="M29 35 Q32 32 35 35" stroke="#ff85a1" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      )}

      {/* Whiskers */}
      <line x1="12" y1="29" x2="26" y2="31" stroke="#ffb3c6" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12" y1="32" x2="26" y2="32" stroke="#ffb3c6" strokeWidth="1" strokeLinecap="round"/>
      <line x1="38" y1="31" x2="52" y2="29" stroke="#ffb3c6" strokeWidth="1" strokeLinecap="round"/>
      <line x1="38" y1="32" x2="52" y2="32" stroke="#ffb3c6" strokeWidth="1" strokeLinecap="round"/>

      {/* Blush */}
      <ellipse cx="20" cy="33" rx="4" ry="2.5" fill="#ff85a1" opacity="0.4"/>
      <ellipse cx="44" cy="33" rx="4" ry="2.5" fill="#ff85a1" opacity="0.4"/>

      {/* Won hearts */}
      {isWon && (
        <>
          <path d="M8 18 C8 15 12 15 12 18 C12 21 8 24 8 24 C8 24 4 21 4 18 Z" fill="#ff4d6d" opacity="0.85"/>
          <path d="M58 14 C58 12 61 12 61 14 C61 16 58 18 58 18 C58 18 55 16 55 14 Z" fill="#ff4d6d" opacity="0.85"/>
        </>
      )}

      {/* Paws */}
      <ellipse cx="18" cy="52" rx="7" ry="5" fill="#ffb3c6"/>
      <ellipse cx="46" cy="52" rx="7" ry="5" fill="#ffb3c6"/>
      <circle cx="16" cy="50" r="1.5" fill="#ffd6e7"/>
      <circle cx="19" cy="49" r="1.5" fill="#ffd6e7"/>
      <circle cx="22" cy="50" r="1.5" fill="#ffd6e7"/>
      <circle cx="44" cy="50" r="1.5" fill="#ffd6e7"/>
      <circle cx="47" cy="49" r="1.5" fill="#ffd6e7"/>
      <circle cx="50" cy="50" r="1.5" fill="#ffd6e7"/>
    </svg>
  );
}
