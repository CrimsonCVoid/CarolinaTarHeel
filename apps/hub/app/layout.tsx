import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Tar Heel Web Co. — fast websites for Carolina small businesses',
    template: '%s · Tar Heel Web Co.',
  },
  description:
    'Productized website builds + simple monthly care for North Carolina small businesses. Fast, owned, and editable in five minutes.',
  metadataBase: new URL(`https://${process.env.NEXT_PUBLIC_BRAND_DOMAIN ?? 'tarheelweb.co'}`),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
