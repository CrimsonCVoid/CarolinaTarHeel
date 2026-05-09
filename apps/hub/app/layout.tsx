import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { TopProgressBar } from '@/components/top-progress-bar';
import { AnalyticsProvider } from '@/components/analytics-provider';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans-runtime', display: 'swap' });
const display = Fraunces({ subsets: ['latin'], variable: '--font-display-runtime', display: 'swap' });

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
  // Layout stays sync so the marketing routes can statically prerender.
  // AnalyticsProvider fetches the signed-in user client-side on mount —
  // that way we don't need cookies() in this layer.
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <AnalyticsProvider
          posthogKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
          posthogHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
        >
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
