// src/app/(provider)/(root)/layout.tsx
import type { Metadata } from 'next';
import '@/app/globals.css';
import Footer from '@/components/ footer';
import QueryProvider from '../Provider';
import TopButton from '@/components/TopButton';
import ServerHeader from '@/components/ServerHeader';

export const metadata: Metadata = {
  title: '코듀(CodeU)',
  description: '함께 성장하는 프로그래머'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ServerHeader />
          {children}
          <TopButton />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
