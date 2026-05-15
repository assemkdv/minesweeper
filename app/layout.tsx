import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400','500','600','700','800','900'],
});

export const metadata: Metadata = {
  title: 'MinesweeperPro',
  description: 'Minesweeper with AI coach, daily challenges, and global leaderboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('theme');
            if (t === 'dark') document.documentElement.classList.add('dark');
          } catch(e) {}
        `}}/>
      </head>
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
