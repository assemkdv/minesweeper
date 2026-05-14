import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MinesweeperPro — Master Probability',
  description: 'The smartest Minesweeper on the web. AI Coach, Daily Challenges, Global Leaderboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');}catch{}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
