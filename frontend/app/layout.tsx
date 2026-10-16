import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'NetworkTrace | Graph-Based Network Intelligence Platform',
  description: 'Precision graph analytics, Louvain community detection, bridge analysis, Crime in India contextual statistics, and supervised ML forecasting engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-slate-950 text-slate-100 min-h-screen flex`}>
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen min-w-0">
          {children}
        </div>
      </body>
    </html>
  );
}
