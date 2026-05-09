import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans-runtime', display: 'swap' });
const display = Fraunces({ subsets: ['latin'], variable: '--font-display-runtime', display: 'swap' });

export const metadata: Metadata = {
  // Per-page metadata is supplied by [[...slug]]/page.tsx
  title: 'Site',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
