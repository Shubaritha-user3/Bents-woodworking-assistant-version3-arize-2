// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { AmplitudeProvider } from '@/app/context/AmplitudeContext';
import Script from 'next/script';
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Bents Woodworking Assistant",
  description: "A woodworking assistant for Bents",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className={inter.className}>
        <head>
          <Script
            src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"
            strategy="beforeInteractive"
          />
          <Script
            src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.6.22-min.js.gz"
            strategy="beforeInteractive"
          />
          <Script id="amplitude-init">
            {`
              window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
              window.amplitude.init('2ebec7feee191712641de915f259fd72', {
                "autocapture": {
                  "elementInteractions": true
                }
              });
            `}
          </Script>
        </head>
        <body className="antialiased">
          <AmplitudeProvider apiKey={process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY}>
            {children}
          </AmplitudeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
